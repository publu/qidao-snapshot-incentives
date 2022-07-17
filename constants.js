const SECONDS_PER_WEEK = 604_800
const QI_PER_WEEK = 180_000
const QI_PER_SECOND = QI_PER_WEEK / SECONDS_PER_WEEK

const VAULTS = {
  "WBTC (Optimism)": {
    address: "0xb9c8f0d3254007ee4b98970b94544e473cd610ec",
    chainId: "10",
    minCdr: 130,
    collateralDecimals: 8,
  },
  "WETH (Optimism)": {
    address: "0x062016cd29fabb26c52bab646878987fc9b0bc55",
    chainId: "10",
    minCdr: 130,
    collateralDecimals: 18,
  },
  "WETH (Polygon)": {
    address: "0x3fd939B017b31eaADF9ae50C7fF7Fa5c0661d47C",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "WETH (Arbitrum)": {
    address: "0xC76a3cBefE490Ae4450B2fCC2c38666aA99f7aa0",
    chainId: 42161,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "WBTC (Arbitrum)": {
    address: "0xb237f4264938f0903f5ec120bb1aa4bee3562fff",
    chainId: 42161,
    minCdr: 130,
    collateralDecimals: 8,
  },
  "WBTC (Polygon)": {
    address: "0x37131aEDd3da288467B6EBe9A77C523A700E6Ca1",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 8,
  },
  "LINK (Polygon)": {
    address: "0x61167073E31b1DAd85a3E531211c7B8F1E5cAE72",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "AAVE (Polygon)": {
    address: "0x87ee36f780ae843A78D5735867bc1c13792b7b11",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "CRV (Polygon)": {
    address: "0x98B5F32dd9670191568b661a3e847Ed764943875",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "Compounding Aave MATIC (Polygon)": {
    address: "0x88d84a85A87ED12B8f098e8953B322fF789fCD1a",
    chainId: 137,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "Compounding Aave ETH (Polygon)": {
    address: "0x11A33631a5B5349AF3F165d2B7901A4d67e561ad",
    chainId: 137,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "Compounding Aave AAVE (Polygon)": {
    address: "0x578375c3af7d61586c2C3A7BA87d2eEd640EFA40",
    chainId: 137,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "Compounding Aave WBTC (Polygon)": {
    address: "0x7dda5e1a389e0c1892caf55940f5fce6588a9ae0",
    chainId: 137,
    minCdr: 135,
    collateralDecimals: 8,
  },
  "BAL (Polygon)": {
    address: "0x701A1824e5574B0b6b1c8dA808B184a7AB7A2867",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "dQUICK (Polygon)": {
    address: "0x649Aa6E6b6194250C077DF4fB37c23EE6c098513",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "GHST (Polygon)": {
    address: "0xF086dEdf6a89e7B16145b03a6CB0C0a9979F1433",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "Frax Share (Polygon)": {
    address: "0xff2c44Fb819757225a176e825255a01B3B8BB051",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "cxDOGE (Polygon)": {
    address: "0x7CbF49E4214C7200AF986bc4aACF7bc79dd9C19a",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "cxETH (Polygon)": {
    address: "0x7d36999a69f2b99bf3fb98866cbbe47af43696c8",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "cxADA (Polygon)": {
    address: "0x506533B9C16eE2472A6BF37cc320aE45a0a24F11",
    chainId: 137,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "vGHST (Polygon)": {
    address: "0x1F0aa72b980d65518e88841bA1dA075BD43fa933",
    chainId: 137,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "WETH (Fantom)": {
    address: "0xD939c268C49c442F037E968F045ba02f499562D4",
    chainId: 250,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "Yearn vault WFTM (Fantom)": {
    address: "0x7efB260662a6FA95c1CE1092c53Ca23733202798",
    chainId: 250,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "Yearn vault YFI (Fantom)": {
    address: "0x6d6029557a06961aCC5F81e1ffF5A474C54e32Fd",
    chainId: 250,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "Yearn vault BTC (Fantom)": {
    address: "0x571F42886C31f9b769ad243e81D06D0D144BE7B4",
    chainId: 250,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "Yearn vault ETH (Fantom)": {
    address: "0x7aE52477783c4E3e5c1476Bbb29A8D029c920676",
    chainId: 250,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "WFTM (Fantom)": {
    address: "0x1066b8FC999c1eE94241344818486D5f944331A0",
    chainId: 250,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "WBTC (Fantom)": {
    address: "0xE5996a2cB60eA57F03bf332b5ADC517035d8d094",
    chainId: 250,
    minCdr: 130,
    collateralDecimals: 8,
  },
  "LINK (Fantom)": {
    address: "0xd6488d586E8Fcd53220e4804D767F19F5C846086",
    chainId: 250,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "xBOO (Fantom)": {
    address: "0x3f6cf10e85e9c0630856599fab8d8bfcd9c0e7d4",
    chainId: 250,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "SAND (Polygon)": {
    address: "0x305f113ff78255d4F8524c8F50C7300B91B10f6A",
    chainId: 137,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "CEL (Polygon)": {
    address: "0x178f1c95c85fe7221c7a6a3d6f12b7da3253eeae",
    chainId: 137,
    minCdr: 135,
    collateralDecimals: 4,
  },
  "Wrapped MATIC (Polygon)": {
    address: "0x305f113ff78255d4f8524c8f50c7300b91b10f6a",
    chainId: 137,
    minCdr: 120,
    collateralDecimals: 18,
  },
  "SUSHI (Fantom)": {
    address: "0x267bDD1C19C932CE03c7A62BBe5b95375F9160A6",
    chainId: 250,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "AAVE (Fantom)": {
    address: "0xdB09908b82499CAdb9E6108444D5042f81569bD9",
    chainId: 250,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "Beefy Scream BTC (Fantom)": {
    address: "0x5563Cc1ee23c4b17C861418cFF16641D46E12436",
    chainId: 250,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "Beefy Scream WETH (Fantom)": {
    address: "0xC1c7eF18ABC94013F6c58C6CdF9e829A48075b4e",
    chainId: 250,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "Beefy Scream FTM (Fantom)": {
    address: "0x3609A304c6A41d87E895b9c1fd18c02ba989Ba90",
    chainId: 250,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "Beefy Scream LINK (Fantom)": {
    address: "0x8e5e4D08485673770Ab372c05f95081BE0636Fa2",
    chainId: 250,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "mooBIFI (Fantom)": {
    address: "0x75d4ab6843593c111eeb02ff07055009c836a1ef",
    chainId: 250,
    minCdr: 140,
    collateralDecimals: 18,
  },
  "Beefy Aave AVAX (Avalanche)": {
    address: "0xfA19c1d104F4AEfb8d5564f02B3AdCa1b515da58",
    chainId: 43114,
    minCdr: 135,
    collateralDecimals: 18,
  },
  "WBTC (Avalanche)" : {
    address: '0x1f8f7a1d38e41eaf0ed916def29bdd13f2a3f11a',
    chainId: 43114,
    minCdr: 130,
    collateralDecimals: 8
  },
  "WAVAX (Avalanche)" : {
    address: '0x73a755378788a4542a780002a75a7bae7f558730',
    chainId: 43114,
    minCdr: 130,
    collateralDecimals: 18
  },
  "WETH (Avalanche)" : {
    address: '0xa9122dacf3fccf1aae6b8ddd1f75b6267e5cbbb8',
    chainId: 43114,
    minCdr: 130,
    collateralDecimals: 18
  },
  "ETH (Moonriver)": {
    address: "0x4a0474E3262d4DB3306Cea4F207B5d66eC8E0AA9",
    chainId: 1285,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "MOVR (Moonriver)": {
    address: "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
    chainId: 1285,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "ETH (Harmony)": {
    address: "0x46469f995A5CB60708200C25EaD3cF1667Ed36d6",
    chainId: 1666600000,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "ONE (Harmony)": {
    address: "0x12FcB286D664F37981a42cbAce92eAf28d1dA94f",
    chainId: 1666600000,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "WETH (Gnosis Chain)": {
    address: "0x5c49b268c9841AFF1Cc3B0a418ff5c3442eE3F3b",
    chainId: 100,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "GNO (Gnosis Chain)": {
    address: "0x014a177e9642d1b4e970418f894985dc1b85657f",
    chainId: 100,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "BNB (BNB)": {
    address: "0xa56f9a54880afbc30cf29bb66d2d9adcdcaeadd6",
    chainId: 56,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "CAKE (BNB)": {
    address: "0x014a177e9642d1b4e970418f894985dc1b85657f",
    chainId: 56,
    minCdr: 130,
    collateralDecimals: 18,
  },
  "DODO (BNB)": {
    address: "0x7333fd58d8d73a8e5fc1a16c8037ada4f580fa2b",
    chainId: 56,
    minCdr: 130,
    collateralDecimals: 18,
  }
};

module.exports = {
  VAULTS,
  QI_PER_SECOND,
};
