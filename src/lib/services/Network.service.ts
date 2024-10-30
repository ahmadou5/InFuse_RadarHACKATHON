import { apiResponse } from "../api.helpers";
import { supabaseClient } from "../supabase_client.utils";

export class NetworkServices {
  static async getAllNetworks() {
    try {
      const { data, error } = await supabaseClient.from("Tokens").select("*");
      if (data) {
        return apiResponse(true, "Network Fetched Success", data![0]);
      }
      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      if (error instanceof Error)
        return apiResponse(false, "Error Fetching Networs", error.message);
    }
  }
  static async getSolana() {
    try {
      const { data, error } = await supabaseClient
        .from("Networks")
        .select("*")
        .eq("name", "solana");
      if (data) {
        return apiResponse(true, "solana gotten", data![0]);
      }
      if (error) throw error;
    } catch (error: unknown) {
      if (error instanceof Error)
        return apiResponse(false, "failed", error.message);
    }
  }
}
