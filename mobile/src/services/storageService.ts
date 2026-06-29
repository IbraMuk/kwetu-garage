import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_INFO: '@user_info',
  IS_LOGGED_IN: '@is_logged_in',
};

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

export const storageService = {
  // Token d'authentification
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // Informations utilisateur
  async setUserInfo(userInfo: UserInfo): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  },

  async getUserInfo(): Promise<UserInfo | null> {
    try {
      const userInfoStr = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
      return userInfoStr ? JSON.parse(userInfoStr) : null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  },

  async removeUserInfo(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO);
    } catch (error) {
      console.error('Error removing user info:', error);
    }
  },

  // État de connexion
  async setLoggedIn(isLoggedIn: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(isLoggedIn));
    } catch (error) {
      console.error('Error saving login state:', error);
    }
  },

  async isLoggedIn(): Promise<boolean> {
    try {
      const isLoggedInStr = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      return isLoggedInStr ? JSON.parse(isLoggedInStr) : false;
    } catch (error) {
      console.error('Error getting login state:', error);
      return false;
    }
  },

  // Nettoyage complet (déconnexion)
  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_INFO,
        STORAGE_KEYS.IS_LOGGED_IN,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },
};
