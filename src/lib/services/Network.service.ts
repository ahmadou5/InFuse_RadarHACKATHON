import { networkList } from '@/utils/networks.utils';

export class NetworkServices {
  static async getAllNetworks() {
    try {
      const data = networkList;
      return data;
    } catch (error: unknown) {
      console.error(error);
    }
  }
  static async getSolana() {
    try {
      const data = networkList[0];
      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
