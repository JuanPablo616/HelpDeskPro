"use client";

import { useEffect, useState, useCallback, startTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getTickets,
  updateTicket,
  deleteTicket,
  Ticket,
} from "@/services/ticketService";

export default function AgentTicketsPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const loadTickets = useCallback(async () => {
    if (!token) return;

    const params: { status?: string; priority?: string } = {};

    if (filterStatus !== "all") params.status = filterStatus;
    if (filterPriority !== "all") params.priority = filterPriority;

    try {
      const data = await getTickets(token, params);
      setTickets(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar tickets");
    }
  }, [token, filterStatus, filterPriority]);

  useEffect(() => {
    if (!user || user.role !== "agent") {
      router.push("/login");
      return;
    }

    startTransition(() => {
      loadTickets();
    });
  }, [user, token, router, loadTickets]);

  async function handleChangeStatus(id: string, newStatus: string) {
    if (!token) return;
    await updateTicket(token, { id, status: newStatus });
    loadTickets();
  }

  async function handleChangePriority(id: string, newPriority: string) {
    if (!token) return;
    await updateTicket(token, { id, priority: newPriority });
    loadTickets();
  }

  async function handleAssignToMe(id: string) {
    if (!token || !user) return;
    await updateTicket(token, { id, assignedTo: user.id });
    loadTickets();
  }

  async function handleDelete(id: string) {
    if (!token) return;
    if (!confirm("¿Eliminar este ticket?")) return;
    await deleteTicket(token, id);
    loadTickets();
  }

  return (
    <main className="agent-container">

      <h1 className="panel-title">Panel de Agente</h1>

      {/* FILTROS */}
      <section className="filters-section">
        <h3>Filtros</h3>

        <div className="filters-row">
          <div>
            <label>Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="open">Open</option>
              <option value="in-progress">En progreso</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label>Prioridad</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <button className="button-primary" onClick={loadTickets}>
            Aplicar filtros
          </button>
        </div>
      </section>

      {/* LISTA DE TICKETS */}
      <div className="tickets-grid">
        {tickets.map((t) => (
          <div key={t._id} className="ticket-card">

            <h2 className="ticket-title">{t.title}</h2>
            <p className="ticket-description">{t.description}</p>

            <p><b>Estado:</b> {t.status}</p>
            <p><b>Prioridad:</b> {t.priority}</p>
            <p><b>Cliente:</b> {t.createdBy?.name}</p>

            <div className="actions-row">

              <button onClick={() => handleChangeStatus(t._id, "in-progress")}>
                En progreso
              </button>

              <button onClick={() => handleChangeStatus(t._id, "closed")}>
                Cerrar
              </button>

              <button onClick={() => handleAssignToMe(t._id)}>
                Asignarme
              </button>

              <select
                defaultValue={t.priority}
                onChange={(e) => handleChangePriority(t._id, e.target.value)}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>

              <button className="delete-btn" onClick={() => handleDelete(t._id)}>
                Eliminar
              </button>

              <button
                className="details-btn"
                onClick={() => router.push(`/tickets/${t._id}`)}
              >
                Ver detalles
              </button>

            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
