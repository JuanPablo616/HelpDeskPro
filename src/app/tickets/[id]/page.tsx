"use client";

import { useEffect, useState, useCallback, startTransition } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { getComments, addComment } from "@/services/commentService";
import { useAuth } from "@/context/AuthContext";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Comment {
  _id: string;
  message: string;
  createdAt: string;
  userId: {
    name: string;
  };
}

export default function TicketDetailPage() {
  const { id: ticketId } = useParams();
  const { user, token } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");

  
  // loadTicket

  const loadTicket = useCallback(async () => {
    if (!ticketId) return;
    try {
      const res = await axios.get(`/api/tickets?id=${ticketId}`);
      setTicket(res.data);
    } catch (error) {
      console.error("Error loading ticket:", error);
    }
  }, [ticketId]);


  // loadComments
 
  const loadComments = useCallback(async () => {
    if (!ticketId) return;
    try {
      const data = await getComments(ticketId as string);
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }, [ticketId]);


  useEffect(() => {
    if (!ticketId) return;

    startTransition(() => {
      loadTicket();
      loadComments();
    });
  }, [ticketId, loadTicket, loadComments]);


  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) return;
    if (!token || !user) return;

    try {
      await addComment(token, {
        ticketId: ticketId as string,
        userId: user.id,
        message,
      });

      setMessage("");
      loadComments(); // refrescar comentarios
    } catch (error) {
      console.error("Error sending comment:", error);
      alert("No se pudo enviar el comentario");
    }
  }

  if (!ticket) return <p className="p-6">Cargando ticket...</p>;

  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">

      <h1 className="text-3xl font-bold">{ticket.title}</h1>

      <p className="text-gray-700">{ticket.description}</p>

      <div className="text-sm text-gray-500">
        <p>
          <strong>Prioridad:</strong> {ticket.priority}
        </p>
        <p>
          <strong>Estado:</strong> {ticket.status}
        </p>
        <p>
          <strong>Creado por:</strong> {ticket.createdBy?.name}
        </p>
      </div>

      {/* Sección de comentarios */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Comentarios</h2>

        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c._id} className="border p-3 rounded">
              <p className="font-semibold">{c.userId?.name}</p>
              <p className="text-sm">{c.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Agregar comentario */}
        <form onSubmit={handleAddComment} className="mt-4 space-y-2">
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Escribe un comentario..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Enviar comentario
          </button>
        </form>
      </section>
    </main>
  );
}
