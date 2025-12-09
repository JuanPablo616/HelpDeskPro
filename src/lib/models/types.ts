export type UserRole = "client" | "agent";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface ITicket {
  _id?: string;
  title: string;
  description: string;
  createdBy: string;     // user id
  assignedTo?: string;   // agent id
  status: TicketStatus;
  priority: TicketPriority;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  _id?: string;
  ticketId: string;
  author: string; // user id
  message: string;
  createdAt?: Date;
}
