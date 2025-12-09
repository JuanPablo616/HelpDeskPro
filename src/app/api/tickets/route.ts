import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Ticket } from "@/lib/models/Ticket";
import { User } from "@/lib/models/User";
import { Types } from "mongoose";
import { sendMail } from "@/lib/email";
import { emailTemplate } from "@/lib/emailTemplates";

interface CreateTicketPayload {
  title: string;
  description: string;
  priority?: string;
  createdBy: string;
  assignedTo?: string;
}

interface UpdateTicketPayload {
  id: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
}


// Listar tickets o uno por id

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const createdBy = searchParams.get("createdBy");

    if (id && !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    if (id) {
      const ticket = await Ticket.findById(id).populate("createdBy assignedTo");

      if (!ticket)
        return NextResponse.json({ message: "No encontrado" }, { status: 404 });

      return NextResponse.json(ticket);
    }

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (createdBy) filter.createdBy = createdBy;

    const tickets = await Ticket.find(filter)
      .populate("createdBy assignedTo")
      .sort({ createdAt: -1 });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("GET Ticket Error:", error);
    return NextResponse.json({ message: "Error obteniendo tickets" }, { status: 500 });
  }
}

// crear ticket (cliente)
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as CreateTicketPayload;
    const { title, description, priority, createdBy, assignedTo } = body;

    if (!title || !description || !createdBy) {
      return NextResponse.json(
        { message: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const newTicket = await Ticket.create({
      title,
      description,
      priority: priority || "medium",
      status: "open",
      createdBy: new Types.ObjectId(createdBy),
      assignedTo: assignedTo ? new Types.ObjectId(assignedTo) : undefined,
    });

    //   ENVÍO DE EMAILS


    // Email al CLIENTE
    const client = await User.findById(createdBy);

    if (client) {
      await sendMail(
        client.email,
        "Tu ticket ha sido creado",
        emailTemplate({
          title: "Ticket creado 🎫",
          message: `
            <p>Hola <b>${client.name}</b>,</p>
            <p>Tu ticket <b>${newTicket.title}</b> ha sido registrado correctamente.</p>
            <p>Estado inicial: <b>${newTicket.status}</b></p>
          `,
        })
      );
    }

    // Email a TODOS los AGENTES
    const agents = await User.find({ role: "agent" });

    for (const agent of agents) {
      await sendMail(
        agent.email,
        "Nuevo ticket disponible",
        emailTemplate({
          title: "Nuevo ticket asignable",
          message: `
            <p>Hola <b>${agent.name}</b>,</p>
            <p>Se ha creado un nuevo ticket:</p>
            <ul>
              <li><b>Título:</b> ${newTicket.title}</li>
              <li><b>Descripción:</b> ${newTicket.description}</li>
              <li><b>Prioridad:</b> ${newTicket.priority}</li>
            </ul>
            <p>Puedes asignártelo desde tu panel de agente.</p>
          `,
        })
      );
    }

   

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error("POST Ticket Error:", error);
    return NextResponse.json({ message: "Error creando ticket" }, { status: 500 });
  }
}


//Actualizar ticket (agente)

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as UpdateTicketPayload;
    const { id, status, priority, assignedTo } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Falta ID del ticket" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = new Types.ObjectId(assignedTo);

    updateData.updatedAt = new Date();

    const updatedTicket = await Ticket.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("createdBy assignedTo");

    if (!updatedTicket) {
      return NextResponse.json(
        { message: "Ticket no encontrado" },
        { status: 404 }
      );
    }


    //Email al cliente si se asignó un agente
 
    if (assignedTo) {
      await sendMail(
        updatedTicket.createdBy.email,
        "Tu ticket ha sido asignado",
        emailTemplate({
          title: "Ticket asignado",
          message: `
            <p>Hola <b>${updatedTicket.createdBy.name}</b>,</p>
            <p>Tu ticket <b>${updatedTicket.title}</b> ahora está asignado al agente <b>${updatedTicket.assignedTo.name}</b>.</p>
          `,
        })
      );
    }

  
    // Email al cliente si se cerró el ticket
   
    if (status === "closed") {
      await sendMail(
        updatedTicket.createdBy.email,
        "Tu ticket ha sido cerrado",
        emailTemplate({
          title: "Ticket cerrado",
          message: `
            <p>Hola <b>${updatedTicket.createdBy.name}</b>,</p>
            <p>Tu ticket <b>${updatedTicket.title}</b> ha sido marcado como <b>CERRADO</b>.</p>
          `,
        })
      );
    }

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("PUT Ticket Error:", error);
    return NextResponse.json({ message: "Error actualizando ticket" }, { status: 500 });
  }
}

// eliminar ticket
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Falta ID" }, { status: 400 });
    }

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const deleted = await Ticket.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    console.error("DELETE Ticket Error:", error);
    return NextResponse.json({ message: "Error eliminando ticket" }, { status: 500 });
  }
}
