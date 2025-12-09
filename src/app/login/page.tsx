"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <main className="auth-container">
      <form onSubmit={handleSubmit} className="auth-box">
        
        <h1 className="auth-title">HelpDeskPro</h1>
        <p className="auth-subtitle">Iniciar sesión</p>

        <input
          className="auth-input"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="auth-button">
          Ingresar
        </button>

        <p className="auth-link" onClick={() => router.push("/signup")}>
          ¿No tienes cuenta? <span>Regístrate aquí</span>
        </p>

      </form>
    </main>
  );
}
