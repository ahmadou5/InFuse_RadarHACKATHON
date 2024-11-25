import { apiResponse } from "../api.helpers";
import { supabaseClient } from "../supabase_client.utils";
export class UserService {
  static async GetUser() {
    try {
      const { data: user, error } = await supabaseClient
        .from("SolWallet")
        .select("*");
      if (error) return apiResponse(false, error?.message, error);
      return apiResponse(true, "details", user![0]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiResponse(false, "failed  error", error.message);
      } else {
        throw new Error(
          "An unknown error occurred while creating the transaction"
        );
      }
    }
  }
  static async CreateUser(payload: {
    user_id: number;
    email: string;
    username: string;
    ethAddress: string | undefined;
    ethPrivateKey: string | undefined;
    suiAddress: string | undefined;
    //suiPublicKey: string | undefined;
    suiPrivateKey: string | undefined;
    solPublicKey: string | undefined;
    tonPublicKey: string | undefined;
    tonPrivateKey: string | undefined;
    solPrivateKey: string | undefined;
    mnemonic: string | undefined;
    pin: string | undefined;
  }) {
    try {
      const checkUser = await supabaseClient
        .from("walletUsers")
        .select("*")
        .eq("id", payload.user_id)
        .eq("email", payload.email)
        .eq("username", payload.username)
        .eq("ethAddress", payload.ethAddress)
        .eq("ethPrivateKey", payload.ethPrivateKey)
        .eq("solPublicKey", payload.solPublicKey)
        .eq("solPrivateKey", payload.solPrivateKey)
        //.eq("suiPublicKey", payload.suiPublicKey)
        .eq("suiAddress", payload.suiAddress)
        .eq("suiPrivateKey", payload.suiPrivateKey)
        .eq("tonPublicKey", payload.tonPublicKey)
        .eq("tonPrivateKey", payload.tonPrivateKey)
        .eq("mnemonic", payload.mnemonic)
        .eq("pin", payload.pin);
      if (checkUser.error)
        return apiResponse(
          false,
          "user details",
          checkUser?.error?.message || "something went wrong"
        );
      if (checkUser.data[0])
        return apiResponse(false, "You already Register that", undefined);

      const { data: user, error } = await supabaseClient
        .from("walletUsers")
        .insert([
          {
            id: payload.user_id,
            email: payload.email,
            username: payload.username,
            pin: payload.pin,
            mnemonic: payload.mnemonic,
            privateKey: payload.solPrivateKey,
            publicKey: payload.solPublicKey,
          },
        ])
        .select("*");
      if (error) return apiResponse(false, error?.message, error);
      return apiResponse(true, "details", user![0]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiResponse(false, "failed  error", error.message);
      } else {
        throw new Error(
          "An unknown error occurred while creating the transaction"
        );
      }
    }
  }
  static async GetUserByID(telegramID: number) {
    try {
      const { data: user, error } = await supabaseClient
        .from("walletUsers")
        .select("*")
        .eq("id", telegramID)
        .single();

      if (error) {
        return apiResponse(false, error?.message, error);
      } else return apiResponse(true, "details", user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiResponse(false, "failed  error", error.message);
      } else {
        throw new Error(
          "An unknown error occurred while creating the transaction"
        );
      }
    }
  }
}
