import { apiResponse } from "../api.helpers";
import { supabaseClient } from "../supabase_client.utils";
export class UserService {
   static async GetUser() { 
    try {
        const { data:user, error} = await supabaseClient
        .from('SolWallet')
        .select('*')
        if (error)
          return apiResponse(false, error?.message, error)
        return apiResponse(true, 'details', user![0] )
    } catch (error: unknown) {
        if (error instanceof Error) {
            return apiResponse(false, 'failed  error', error.message )
          } else {
            throw new Error('An unknown error occurred while creating the transaction');
          }
        
    }

   }
   static async GetUserByID(telegramID:number) { 
    try {
        const { data:user, error} = await supabaseClient
        .from('SolWallet')
        .select('*')
        .eq('id',telegramID)
        if (error)
          return apiResponse(false, error?.message, error)
        return apiResponse(true, 'details', user![0] )
    } catch (error: unknown) {
        if (error instanceof Error) {
            return apiResponse(false, 'failed  error', error.message )
          } else {
            throw new Error('An unknown error occurred while creating the transaction');
          }
        
    }

   }
}