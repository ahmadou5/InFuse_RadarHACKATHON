import { Token } from "@/utils/tokens.utils";
import { apiResponse } from "../api.helpers";
import { supabaseClient } from "../supabase_client.utils";

export class TokenService {
  static async getTokenByAddress(address: string) {
    try {
      const { data: tokens, error } = await supabaseClient
        .from("Token")
        .select("*")
        .eq("address", address);

      if (error) return apiResponse(false, error?.message, error);
      return apiResponse(true, "get tokens", tokens);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiResponse(false, "failed token error", error.message);
      } else {
        throw new Error("An unknown error occurred while fetching tokens");
      }
    }
  }

  static async getTokenBytoken_id(id: string) {
    try {
      const { data: tokens, error } = await supabaseClient
        .from("Token")
        .select("*")
        .eq("token_id", id);

      if (error) return apiResponse(false, error?.message, error);
      return apiResponse(true, "get tokens by ID", tokens);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiResponse(false, "failed token error", error.message);
      } else {
        throw new Error("An unknown error occurred while fetching tokens");
      }
    }
  }

  static async getTokenBytoken_compress(address: string) {
    try {
      const { data: tokens, error } = await supabaseClient
        .from("Token")
        .select("*")
        .eq("compress_address", address);

      if (error) return apiResponse(false, error?.message, error);
      return apiResponse(true, "get tokens by ID", tokens);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiResponse(false, "failed token error", error.message);
      } else {
        throw new Error("An unknown error occurred while fetching tokens");
      }
    }
  }

  static async getCompressToken(address: string) {
    try {
      const tokens = Token.find((token) => token.compress_address === address);
      return apiResponse(true, "get Compress tokens by address", tokens);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiResponse(
          false,
          "failed to fetch compress details",
          error.message
        );
      } else {
        throw new Error("An unknown error occurred while fetching tokens");
      }
    }
  }

  static async getTokens() {
    try {
      return apiResponse(true, "get all tokens", Token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return apiResponse(false, "failed token error", error.message);
      } else {
        throw new Error("An unknown error occurred while fetching tokens");
      }
    }
  }
}
