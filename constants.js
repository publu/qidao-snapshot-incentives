const SECONDS_PER_WEEK = 604_800
const QI_PER_WEEK = 180_000
const QI_PER_SECOND = QI_PER_WEEK / SECONDS_PER_WEEK
// const API_HOST = "http://localhost:3000"
const API_HOST = "https://api.mai.finance"
async function fetchVaults() {
  const res = await (await fetch(`${API_HOST}/v2/collaterals`)).json()
  return Object.fromEntries(Object.values(res).flat().map(c => {
    return [c.snapshotName,
      {
        address: c.vaultAddress,
        chainId: c.chainId,
        minCdr: c.minimumCDR,
        collateralDecimals: c.token.decimals
      }];
  }))
}

module.exports = {
  fetchVaults,
  QI_PER_SECOND,
};
