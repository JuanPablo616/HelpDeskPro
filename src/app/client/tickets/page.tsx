"use client";

import { useEffect, useState, useCallback, startTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getTickets, createTicket, Ticket } from "@/services/ticketService";

export default function ClientTicketsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadTickets = useCallback(async () => {
    if (!token || !user) return;

    try {
      // solo tickets del cliente
      const data = await getTickets(token, { createdBy: user.id });
      setTickets(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar tickets");
    }
  }, [token, user]);

  useEffect(() => {
    if (!user || user.role !== "client") {
      router.push("/login");
      return;
    }

    startTransition(() => {
      loadTickets();
    });
  }, [user, token, router, loadTickets]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !description) {
      alert("Completa todos los campos");
      return;
    }
    if (!token || !user) return;

    try {
      await createTicket(token, {
        title,
        description,
        priority: "medium", // el cliente no elige prioridad
        createdBy: user.id,
      });

      setTitle("");
      setDescription("");

      loadTickets();
    } catch (error) {
      console.error(error);
      alert("Error creando ticket");
    }
  }

  return (
    <main className="container space-y-6">
      <h1 className="text-2xl font-bold">Mis Tickets</h1>

      {/* Crear ticket */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Crear nuevo ticket</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-sm">Título</label>
            <input
              className="login-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Problema con el sistema"
            />
          </div>

          <div>
            <label className="text-sm">Descripción</label>
            <textarea
              className="login-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu problema"
            />
          </div>

          <button className="btn-primary">Crear Ticket</button>
        </form>
      </div>

      {/* Lista de tickets */}
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t._id} className="ticket-item">
            <div className="ticket-title">{t.title}</div>
            <p className="ticket-meta">{t.description}</p>
            <p className="ticket-meta">
              Estado: <span className={t.status === "closed" ? "status-closed" : "status-open"}>
                {t.status}
              </span>
            </p>
            <p className="ticket-meta">
              Prioridad: <span className={`badge priority-${t.priority}`}>{t.priority}</span>
            </p>

            <button
              className="btn-secondary mt-2"
              onClick={() => router.push(`/tickets/${t._id}`)}
            >
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
