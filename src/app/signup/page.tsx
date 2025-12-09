"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error inesperado");
      return;
    }

    alert("Registro exitoso");
    router.push("/login");
  }

  return (
    <main className="auth-container">
      <form className="auth-box" onSubmit={handleRegister}>
        <h1 className="auth-title">Crear cuenta</h1>

        <input
          className="auth-input"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="auth-input"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-button" type="submit">
          Registrarme
        </button>

        <p className="auth-link" onClick={() => router.push("/login")}>
          ¿Ya tienes cuenta? <span>Inicia sesión</span>
        </p>
      </form>
    </main>
  );
}
