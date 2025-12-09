"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getTickets, updateTicket } from "@/services/TicketService";
import { TicketCard } from "../components/TicketCard";

interface Ticket {
  _id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function AgentTicketsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filterStatus, setFilterStatus] = useState("");

  // -----------------------------------------------------
  // ✔ Declarar loadTickets PRIMERO y usar useCallback
  // -----------------------------------------------------
  const loadTickets = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getTickets(token, filterStatus || undefined);
      setTickets(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar tickets");
    }
  }, [token, filterStatus]);

  // -----------------------------------------------------
  // ✔ Ahora sí usamos loadTickets dentro del useEffect
  // -----------------------------------------------------
  useEffect(() => {
    if (!user || user.role !== "agent") {
      router.push("/login");
      return;
    }

    loadTickets();
  }, [user, token, filterStatus, router, loadTickets]);

  async function handleClose(ticketId: string) {
    if (!token) return;
    try {
      await updateTicket(token, { id: ticketId, status: "closed" });
      loadTickets();
    } catch {
      alert("No se pudo cerrar el ticket");
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard de tickets</h1>

      <div className="flex gap-2 items-center mb-4">
        <span>Filtrar por estado:</span>
        <select
          className="border rounded px-2 py-1"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="open">Abiertos</option>
          <option value="in_progress">En progreso</option>
          <option value="resolved">Resueltos</option>
          <option value="closed">Cerrados</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tickets.map((t) => (
          <div key={t._id} className="space-y-2">
            <TicketCard
              title={t.title}
              status={t.status}
              priority={t.priority}
              createdAt={t.createdAt}
              onViewDetail={() => router.push(`/tickets/${t._id}`)}
            />
            {t.status !== "closed" && (
              <button
                className="text-sm text-red-600 underline"
                onClick={() => handleClose(t._id)}
              >
                Marcar como cerrado
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
