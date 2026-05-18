import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getApiErrorMessage } from "../utils/apiHelpers";
import { UserInfo } from "./storageService";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    username?: string;
    is_active?: boolean;
  };
  token: string;
}

export function mapAuthUserToStorage(user: AuthResponse["user"]): UserInfo {
  return {
    id: user.id,
    username: user.username ?? user.email.split("@")[0],
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    is_active: user.is_active ?? true,
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        credentials,
      );
      if (!response.data?.token || !response.data?.user) {
        throw new Error("Réponse serveur invalide");
      }
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erreur de connexion"));
    }
  },

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch {
      // Déconnexion locale même si le serveur ne répond pas
    }
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/auth/register`,
        userData,
      );
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erreur lors de l'inscription"));
    }
  },

  async forgotPassword(_email: string): Promise<void> {
    throw new Error(
      "Réinitialisation par email non disponible. Contactez votre administrateur.",
    );
  },
};
