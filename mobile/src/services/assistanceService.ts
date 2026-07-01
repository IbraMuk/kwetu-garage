import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getApiErrorMessage } from "../utils/apiHelpers";

export type IssueType = "breakdown" | "towing";

export interface AssistanceRequest {
  id: string;
  client_name: string;
  phone: string;
  location: string;
  issue_type: IssueType;
  description: string;
  status: "pending" | "in_progress" | "resolved" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface AssistanceFormData {
  client_name: string;
  phone: string;
  location: string;
  issue_type: IssueType;
  description: string;
}

export const assistanceService = {
  async create(request: AssistanceFormData): Promise<AssistanceRequest> {
    try {
      const response = await axios.post(`${API_BASE_URL}/assistance`, request);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erreur lors de l'envoi de la demande"));
    }
  },

  async getRequests(): Promise<AssistanceRequest[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/assistance`);
      return response.data.data || [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erreur lors de la récupération des demandes"));
    }
  },
};
