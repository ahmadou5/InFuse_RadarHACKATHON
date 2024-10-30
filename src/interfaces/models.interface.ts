export interface UserInterface {
  id: string;
  username: string;
  pin: string;
  publicKey: string;
  privateKey: string;
  mnemonic: string;
}

export interface Transaction {}

export interface Tokens {
  name: string;
  address: string;
  ticker: string;
  logoUrl: string;
  token_id: string;
  owner: string;
  compress_address: string;
}

export interface Native {
  name: string;
  address: string;
  ticker: string;
  logoUrl: string;
  token_id: string;
}

export interface Network {
  name: string;
  mainnetrpcUrl: string | undefined;
  testnetrpcUrl: string | undefined;
  isEVM: boolean;
  isTestNet: boolean;
  native: Native | undefined;
}

export interface BlinkInterface {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  image_url?: string;
  description?: string;
  label?: string;
  pub_key: string;

  created_at: Date;
  updated_at?: Date;
}

export interface TransactionDetails {
  signature: string;
  blockTime: string;
  fee: number;
  direction: "sent" | "received";
  amount: number;
}

export interface TransactionState {
  sent: TransactionDetails[];
  received: TransactionDetails[];
}

export interface Chain {}
