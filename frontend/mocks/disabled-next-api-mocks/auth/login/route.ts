import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Simulation d'une base de données utilisateurs
    const users = [
      {
        id: "1",
        email: "admin@kwetugarage.com",
        password: "password123", // En pratique, utilisez bcrypt
        first_name: "Admin",
        last_name: "User",
        role: "admin",
      },
    ];

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    // Créer un token JWT simple (en pratique, utilisez jsonwebtoken)
    const token = Buffer.from(
      JSON.stringify({ id: user.id, email: user.email }),
    ).toString("base64");

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    // Créer la réponse et définir le cookie
    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
    });

    // Définir le cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
