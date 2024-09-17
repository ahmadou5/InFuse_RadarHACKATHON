import { apiResponse } from "../api.helpers";
import { supabaseClient } from "../supabase_client.utils";





export class TransactionService {
    
   static async GetTransactionByAddress(address: string) { 
    try {
        const { data:transaction, error} = await supabaseClient
        .from('SolHistory')
        .select('*')
        .eq('sender', address)

        if (error)
          return apiResponse(false, error?.message, error)
        return apiResponse(true, 'user activity', transaction![0] )
    } catch (error: unknown) {
        if (error instanceof Error) {
            return apiResponse(false, 'failed  error', error.message )
          } else {
            throw new Error('An unknown error occurred while creating the transaction');
          }
        
    }

   }

   
}