import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/Comment";
import { Ticket } from "@/lib/models/Ticket";
import { Types } from "mongoose";


interface CreateCommentPayload {
  ticketId: string;
  userId: string;
  message: string;
}

export async function GET() {
  try {
    await connectDB();
    const comments = await Comment.find().populate("userId ticketId");
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("GET Comments Error:", error);
    return NextResponse.json(
      { message: "Error obteniendo comentarios" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as CreateCommentPayload;

    const { ticketId, userId, message } = body;

    if (!ticketId || !userId || !message) {
      return NextResponse.json(
        { message: "Faltan datos del comentario" },
        { status: 400 }
      );
    }

    const newComment = await Comment.create({
      ticketId: new Types.ObjectId(ticketId),
      userId: new Types.ObjectId(userId),
      message,
    });

    // Actualizar el ticket 
    await Ticket.findByIdAndUpdate(ticketId, { updatedAt: new Date() });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("POST Comment Error:", error);
    return NextResponse.json(
      { message: "Error creando comentario" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
      return NextResponse.json(
        { message: "Falta id del comentario" },
        { status: 400 }
      );
    }

    const deleted = await Comment.findByIdAndDelete(commentId);

    if (!deleted) {
      return NextResponse.json(
        { message: "Comentario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Comentario eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Comment Error:", error);
    return NextResponse.json(
      { message: "Error eliminando comentario" },
      { status: 500 }
    );
  }
}
