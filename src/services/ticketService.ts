import axios from "axios";

export interface TicketUser {
  _id: string;
  name: string;
  email: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  createdBy: TicketUser;
  assignedTo?: TicketUser;
}

export interface GetTicketsParams {
  status?: string;
  priority?: string;
  createdBy?: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority?: string;
  createdBy: string;
  assignedTo?: string;
}

export interface UpdateTicketRequest {
  id: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
}

const api = axios.create({
  baseURL: "/api",
});

// lista tickets (con filtros opcionales)
export async function getTickets(
  _token: string,
  params?: GetTicketsParams
): Promise<Ticket[]> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.priority) search.set("priority", params.priority);
  if (params?.createdBy) search.set("createdBy", params.createdBy);

  const url = `/tickets${search.toString() ? `?${search.toString()}` : ""}`;
  const res = await api.get(url);
  return res.data;
}

// crea ticket (cliente)
export async function createTicket(
  _token: string,
  data: CreateTicketRequest
): Promise<Ticket> {
  const res = await api.post("/tickets", data);
  return res.data;
}

// actualiza ticket (agente)
export async function updateTicket(
  _token: string,
  data: UpdateTicketRequest
): Promise<Ticket> {
  const res = await api.put("/tickets", data);
  return res.data;
}

// elimina ticket (opcional)
export async function deleteTicket(
  _token: string,
  id: string
): Promise<void> {
  await api.delete(`/tickets?id=${id}`);
}
