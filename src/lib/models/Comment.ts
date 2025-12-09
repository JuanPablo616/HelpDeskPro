import { Schema, model, models, Types } from "mongoose";

export interface IComment {
  ticketId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  createdAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    ticketId: {
      type: Types.ObjectId,   
      ref: "Ticket",
      required: true,
    },
    userId: {
      type: Types.ObjectId,   
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment =
  models.Comment || model<IComment>("Comment", commentSchema);
