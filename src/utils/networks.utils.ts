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
      name: "Ethereum",
      address: "",
      ticker: "ETH",
      token_id: "ethereum",
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
      name: "Ethereum",
      address: "",
      ticker: "ETH",
      token_id: "ethereum",
      logoUrl: "/assets/soon.jpeg",
    },
    rpcUrl: ENV.SOON_DEVNET_RPC || "",
    isEVM: false,
    isTestNet: true,
  },
];
