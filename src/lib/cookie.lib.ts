import { UserInterface } from "@/interfaces";
import { Network } from "@/interfaces/models.interface";
import Cookie from "js-cookie";

export default class CookiesService {
  static async setter<T>(key: string, value: T): Promise<boolean> {
    try {
      if (typeof window === "undefined") return false;
      if (value === undefined) return false;

      const stringValue = JSON.stringify(value);
      await Cookie.set(key, stringValue, { sameSite: "strict" });
      return true;
    } catch (err) {
      console.error("Error setting cookie:", err);
      return false;
    }
  }

  static get(key: string): UserInterface | undefined {
    try {
      if (typeof window === "undefined") return undefined;

      const value = Cookie.get(key);
      if (!value) return undefined;

      return JSON.parse(value);
    } catch (err) {
      console.error("Error getting cookie:", err);
      return undefined;
    }
  }

  static getNetwork(key: string): Network | undefined {
    try {
      if (typeof window === "undefined") return undefined;

      const value = Cookie.get(key);
      if (!value) return undefined;

      return JSON.parse(value);
    } catch (err) {
      console.error("Error getting cookie:", err);
      return undefined;
    }
  }

  static remove(key: string): boolean {
    try {
      if (typeof window === "undefined") return false;

      const value = Cookie.get(key);
      if (!value) return false;

      Cookie.remove(key);
      return true;
    } catch (err) {
      console.error("Error removing cookie:", err);
      return false;
    }
  }
}
