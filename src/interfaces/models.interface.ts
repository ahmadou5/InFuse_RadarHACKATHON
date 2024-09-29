export interface UserInterface {
    id: string | undefined;
    username: string;
    pin: string;
    publicKey: string;
    privateKey: string;

}

export interface Transaction {

}

export interface Tokens {

}


export interface BlinkInterface {
    id: string
    user_id: string
    category_id: string
    title: string
    image_url?: string
    description?: string
    label?: string
    pub_key: string
  
    created_at: Date
    updated_at?: Date
  }
  

export interface TransactionDetails {
    signature: string;
    blockTime: string;
    fee: number;
    direction: 'sent' | 'received';
    amount: number;
}
  
export interface TransactionState {
    sent: TransactionDetails[];
    received: TransactionDetails[];
}

export interface Chain {
    
}