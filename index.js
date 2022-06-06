const fs = require("fs");
const path = require("path");
const fetch = require("isomorphic-fetch");
const { VAULTS, QI_PER_SECOND} = require("./constants");
const { BigNumber } = require("ethers");
const { parseUnits } = require("ethers/lib/utils");

const CHAIN_THRESHOLD_BP = 833;

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
            return VAULTS[choice] ? VAULTS[choice].chainId : console.log(choice)
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
      }
    }

    let includedChoicesScoreSum = includedChoices.reduce(
      (prev, curr) => (prev + curr.score),
      0
    );

    let borrowIncentives = [];

    for (let i = 0; i < includedChoices.length; i++) {
      const choice = includedChoices[i];
      const { name, score } = choice;
      const meta = VAULTS[name];
      if (score > 0) {
        const reward = BigNumber.from(Math.trunc(QI_PER_SECOND * 1e10)).mul(1e8)
          .mul(parseUnits(score.toString()))
          .div(parseUnits(includedChoicesScoreSum.toString()));

        console.log("name: ", name)

        const minCdr = meta.minCdr / 100 + 0.25;
        const maxCdr = meta.minCdr / 100 + 2.7;

        borrowIncentives.push({
          name,
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
    }

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
