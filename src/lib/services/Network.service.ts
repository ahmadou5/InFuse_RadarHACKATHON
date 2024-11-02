import { networkList } from "@/utils/networks.utils";
//import { apiResponse } from "../api.helpers";
//import { supabaseClient } from "../supabase_client.utils";

export class NetworkServices {
  static async getAllNetworks() {
    try {
      const data = networkList;
      return data;
    } catch (error: unknown) {
      console.log(error);
    }
  }
  static async getSolana() {
    try {
      const data = networkList[0];
      if (data) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
