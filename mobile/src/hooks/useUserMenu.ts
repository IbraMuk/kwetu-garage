import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import type { MainTabParamList } from "../navigation/types";

/** Menu compte + déconnexion vers l'écran Login. */
export function useUserMenu() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { user, logout } = useAuth();

  const performLogout = async () => {
    await logout();
  };

  const confirmLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous retourner à l'écran de connexion ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          style: "destructive",
          onPress: () => {
            void performLogout();
          },
        },
      ],
    );
  };

  const openUserMenu = () => {
    const title = user ? `${user.first_name} ${user.last_name}` : "Mon compte";
    Alert.alert(title, user?.email ?? "Kwetu Garage", [
      {
        text: "Mon profil",
        onPress: () => navigation.navigate("Profile"),
      },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: confirmLogout,
      },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  return { user, openUserMenu, confirmLogout, performLogout };
}
