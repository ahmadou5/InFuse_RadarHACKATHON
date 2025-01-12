import { Network } from "@/interfaces/models.interface";
import { ENV } from "@/lib/constant/env.constant";

interface NetworkList extends Array<Network> {}
export const inactive: NetworkList = [
  {
    name: "SUI",
    native: {
      name: "SUI",
      address: "",
      ticker: "sui",
      token_id: "",
      logoUrl:
        "https://coin-images.coingecko.com/coins/images/26375/large/sui-ocean-square.png?1727791290",
    },
    rpcUrl: ENV.SUI_MAINNET_RPC || "",
    isEVM: false,
    isTestNet: false,
  },
  {
    name: "SUI",
    native: {
      name: "SUI",
      address: "",
      ticker: "sui",
      token_id: "",
      logoUrl:
        "https://coin-images.coingecko.com/coins/images/26375/large/sui-ocean-square.png?1727791290",
    },
    rpcUrl: ENV.SUI_DEVNET_RPC || "",
    isEVM: false,
    isTestNet: true,
  },
  {
    name: "TON",
    native: {
      name: "TON",
      address: "",
      ticker: "ton",
      token_id: "",
      logoUrl: "/assets/ton.png",
    },
    rpcUrl: ENV.TON_MAINNET_RPC || "",
    isEVM: false,
    isTestNet: false,
  },
  {
    name: "TON",
    native: {
      name: "TON",
      address: "",
      ticker: "ton",
      token_id: "",
      logoUrl: "/assets/ton.png",
    },
    rpcUrl: ENV.TON_DEVNET_RPC || "",
    isEVM: false,
    isTestNet: true,
  },
  {
    name: "ETHEREUM",
    native: {
      name: "ETH",
      address: "",
      ticker: "eth",
      token_id: "",
      logoUrl:
        "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
    },
    rpcUrl: ENV.ETH_MAINNET_RPC || "",
    isEVM: true,
    isTestNet: false,
  },
  {
    name: "ETHEREUM",
    native: {
      name: "ETH",
      address: "",
      ticker: "eth",
      token_id: "",
      logoUrl:
        "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
    },
    rpcUrl: ENV.ETH_TESTNET_RPC || "",
    isEVM: true,
    isTestNet: true,
  },
  {
    name: "CORE",
    native: {
      name: "CORE",
      address: "",
      ticker: "core",
      token_id: "",
      logoUrl: "/assets/core.svg",
    },
    rpcUrl: ENV.CORE_MAINNET_RPC || "",
    isEVM: true,
    isTestNet: false,
  },
  {
    name: "CORE",
    native: {
      name: "CORE",
      address: "",
      ticker: "core",
      token_id: "",
      logoUrl: "/assets/core.svg",
    },
    rpcUrl: ENV.CORE_TESTNET_RPC || "",
    isEVM: true,
    isTestNet: true,
  },
];
export const networkList: NetworkList = [
  {
    name: "SOON",
    native: {
      name: "SOLANA",
      address: "",
      ticker: "SOL",
      token_id: "solana",
      logoUrl: "/assets/soon.jpeg",
    },
    rpcUrl: ENV.SOON_MAINNET_RPC || "",
    isEVM: false,
    isTestNet: false,
  },
  {
    name: "SOLANA",
    native: {
      name: "SOLANA",
      address: "",
      ticker: "SOL",
      token_id: "solana",
      logoUrl:
        "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
    },
    rpcUrl: ENV.SOL_MAINNET_RPC || "",
    isEVM: false,
    isTestNet: false,
  },
  {
    name: "SOLANA",
    native: {
      name: "SOLANA",
      address: "",
      ticker: "SOL",
      token_id: "solana",
      logoUrl:
        "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
    },
    rpcUrl: ENV.SOL_DEVNET_RPC || "",
    isEVM: false,
    isTestNet: true,
  },

  {
    name: "SOON",
    native: {
      name: "SOLANA",
      address: "",
      ticker: "SOL",
      token_id: "solana",
      logoUrl:
        "https://docs.soo.network/~gitbook/image?url=https%3A%2F%2F2478866811-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252Fa24JzwJLe3ovDddlY1Jn%252Fsites%252Fsite_ivI66%252Ficon%252Fg3v3CNr0aS623TxxZmF0%252Fhalf-red-on-black-glow_360.png%3Falt%3Dmedia%26token%3D6b79a2a9-c846-4a63-b09c-b51e653b1974&width=32&dpr=1&quality=100&sign=29a11b88&sv=1",
    },
    rpcUrl: ENV.SOON_DEVNET_RPC || "",
    isEVM: false,
    isTestNet: true,
  },
];
