import { Tokens } from "@/interfaces/models.interface";

interface TokenList extends Array<Tokens> {}
export const Token: TokenList = [
  {
    name: "USDC",
    address: "",
    ticker: "USDC",
    token_id: "usd",
    logoUrl: "",
    chain: "solana",
    isEvm: false,
    compress_address: "",
    owner: "",
    isMainnet: false,
  },
];
