import { apiResponse } from "../api.helpers";
import { supabaseClient } from "../supabase_client.utils";





export class TokenService {
    
   static async getTokenByAddress(address: string) { 
    try {
        const { data:tokens, error} = await supabaseClient
        .from('Token')
        .select('*')
        .eq('address', address)

        if (error)
          return apiResponse(false, error?.message, error)
        return apiResponse(true, 'get tokens', tokens )
    } catch (error: unknown) {
        if (error instanceof Error) {
            return apiResponse(false, 'failed token error', error.message )
          } else {
            throw new Error('An unknown error occurred while fetching tokens');
          }
        
    }

   }
   
   static async getTokens() { 
    try {
        const { data:tokens, error} = await supabaseClient
        .from('Token')
        .select('*')
      
        if (error)
          return apiResponse(false, error?.message, error)
        return apiResponse(true, 'get all tokens', tokens )
    } catch (error: unknown) {
        if (error instanceof Error) {
            return apiResponse(false, 'failed token error', error.message )
          } else {
            throw new Error('An unknown error occurred while fetching tokens');
          }
        
    }

   }
   
}