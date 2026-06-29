import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/apiService";

/** Lie le intercepteur 401 de l'API à la déconnexion React. */
export default function AuthApiBridge() {
  const { handleUnauthorized } = useAuth();

  useEffect(() => {
    apiService.setOnUnauthorized(handleUnauthorized);
    return () => apiService.setOnUnauthorized(null);
  }, [handleUnauthorized]);

  return null;
}
