"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-900 text-white px-4">
      
      {/* Logo / Nombre del proyecto */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow">
          HelpDesk <span className="text-blue-400">Pro</span>
        </h1>
        <p className="mt-2 text-gray-300 text-lg max-w-lg">
          Sistema de gestión de tickets para clientes y agentes. 
          Administra, atiende y resuelve solicitudes de soporte de manera rápida y eficiente.
        </p>
      </div>

      {/* Botones principales */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold transition shadow"
        >
          Iniciar sesión
        </Link>

        <Link
          href="/client/tickets"
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold transition shadow"
        >
          Panel de Cliente
        </Link>

        <Link
          href="/agent/tickets"
          className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg text-lg font-semibold transition shadow"
        >
          Panel de Agente
        </Link>
      </div>

      {/* Footer info */}
      <footer className="text-gray-500 mt-10 text-sm">
        Copyright
      </footer>
    </main>
  );
}
