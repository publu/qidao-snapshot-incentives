const fs = require("fs");
const path = require("path");
const fetch = require("isomorphic-fetch");
const { QI_PER_SECOND, fetchVaults} = require("./constants");
const { BigNumber } = require("ethers");
const { parseUnits } = require("ethers/lib/utils");

const CHAIN_THRESHOLD_BP = 500;

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});

const buildMap = (keys, values) => {
  const map = new Map();
  for (let i = 0; i < keys.length; i++) {
    map.set(String(keys[i]).trim(), values[i]);
  }
  return map;
};

async function main() {
  const VAULTS = await fetchVaults()
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const res = await fetch("https://hub.snapshot.org/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `{
            proposal(id: "${args[0]}") {
                choices
                scores
            }
        }`,
      }),
    });
    const {
      data: {
        proposal: { choices, scores },
      },
    } = await res.json();

    const choiceScoreMap = buildMap(choices.map(c => c.trim()), scores);

    const scoreSum = parseUnits(
      scores.reduce((prev, curr) => (prev + curr), 0).toString()
    );

    let includedChainIds = [];
    let chainIdScoreSumMap = new Map();

    const chainIds = [
      ...new Set(
        choices.map((choice_) =>{
            let choice = choice_.trim()
            return VAULTS[choice] ? VAULTS[choice].chainId : console.log("missing:", choice)
          }
        )
      ),
    ];

    for (const chainId of chainIds) {

      const chainIdVaults = Object.filter(
        VAULTS,
        (choice) => choice.chainId === chainId
      );

      let chainIdSum = 0;
      for (let i = 0; i < Object.keys(chainIdVaults).length; i++) {
        const vault = Object.keys(chainIdVaults)[i];

        if(choiceScoreMap.get(vault)) {
          chainIdSum += choiceScoreMap.get(vault);
        }
      }

      let chainIdScoreSum = parseUnits(chainIdSum.toString());
      chainIdScoreSumMap.set(chainId, chainIdScoreSum);

      if (
        parseFloat(chainIdScoreSum.toString()) /
          parseFloat(scoreSum.toString()) >
        CHAIN_THRESHOLD_BP / 10000
      ) {
        includedChainIds.push(chainId);
      }
    }

    let includedChoices = [];
    for (let i = 0; i < choices.length; i++) {
      const choice = String(choices[i]).trim();
      const score = scores[i];
      if (VAULTS[choice] && includedChainIds.includes(VAULTS[choice].chainId)) {
        includedChoices.push({
          name: choice,
          score: score,
        });
      }else{
        console.log("not getting any: ", choice)
      }
    }

    let includedChoicesScoreSum = includedChoices.reduce(
      (prev, curr) => (prev + curr.score),
      0
    );

    let borrowIncentives = [];


    let winners = []; // list of collaterals who reach cap of 15%
    let maxPercentage = 15; // capped percentage
    let maxRunoff=100; // when you hit a cap, the extra % is distributed amongst the rest
    let keep = [];

    for (let i = 0; i < includedChoices.length; i++) {
      const choice = includedChoices[i];
      const { name, score } = choice;
      const percentage = (score/includedChoicesScoreSum)*100;
      if (!(percentage>=0.0019)) {
        console.log("bye: ", name)
      } else{
        if(percentage>=maxPercentage){
          winners.push({
            name: name,
            percentage: maxPercentage,
          })
          maxRunoff-=maxPercentage;
        }else{
          // runoff
          keep.push(choice)
        }
      }
    }

    includedChoices = keep;
    includedChoicesScoreSum = includedChoices.reduce(
      (prev, curr) => (prev + curr.score),
      0
    );
    // calculate the rest
    for (let i = 0; i < keep.length; i++) {
      const choice = includedChoices[i];
      const { name, score } = choice;
      const percentage = (score/includedChoicesScoreSum)*maxRunoff;

      winners.push({
        name: name,
        percentage: percentage,
      })
    }

    includedChoices = winners;
    includedChoicesScoreSum = winners.reduce(
      (prev, curr) => (prev + curr.percentage),
      0
    );

    includedChoices.sort(function(a, b) {
        return parseFloat(b.percentage) - parseFloat(a.percentage);
    });

    console.log(includedChoicesScoreSum)
    console.log(includedChoices)

    for (let i = 0; i < includedChoices.length; i++) {
      const choice = includedChoices[i];
      const { name, percentage } = choice;
      const meta = VAULTS[name.name];

      const extradecimals = 100000;
      const score = percentage*extradecimals;
        /*

          1) Max 20% and redistribute

          2) Remove chains that dont make it

          3) Remove from includedChoicesScoreSum if too small

        */
      const reward = BigNumber.from(Math.trunc(QI_PER_SECOND * 1e10)).mul(1e8)
          .mul(parseUnits(score.toString()))
          .div(parseUnits(includedChoicesScoreSum.toString()))
          .div(extradecimals);
      const weeklyReward = reward.mul("604800")
      //console.log("name: ", percentage, name, weeklyReward.toString().slice(0,-18),"." ,weeklyReward.toString().slice(-18))

      const minCdr = meta.minCdr / 100 + 0.25;
      const maxCdr = meta.minCdr / 100 + 2.7;

      borrowIncentives.push({
        name: name,
        vaultAddress: meta.address,
        minCdr,
        maxCdr,
        rewardPerSecond: reward.toString(),
        collateralDecimals: meta.collateralDecimals,
        startBlock: 18840162,
        endBlock: 99999999,
        chainId: meta.chainId.toString(),
      });
    }
    console.log("Collateral Reward Count: ", includedChoices.length);
    let values = {};
    [...new Set(borrowIncentives.map((b) => b.chainId))].forEach(
      (chainId) =>
        (values[chainId] = borrowIncentives.filter(
          (incentive) => incentive.chainId === chainId
        ))
    );
    const fileName = path.join(__dirname, `/results/${args[0]}.json`);
    const output = JSON.stringify({
      ...values,
    },null, 2);
    fs.writeFileSync(fileName, output);
  } else {
    console.log("Usage: node index.js <ProposalId>");
  }
}

void main();
