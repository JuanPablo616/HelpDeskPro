import { Schema, model, models, Types } from "mongoose";

// 🚀 Tipo correcto para Next.js + TS + Mongoose
export interface ITicket {
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdBy: string | Types.ObjectId;  // ✔ Fija el error
  assignedTo?: string | Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // ✔ TypeScript ahora está FELIZ
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export const Ticket =
  models.Ticket || model<ITicket>("Ticket", ticketSchema);
