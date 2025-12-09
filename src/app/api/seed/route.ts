import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    // limpiar colección
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("123456", 10);

    await User.insertMany([
      {
        name: "Cliente Prueba",
        email: "cliente@test.com",
        password: passwordHash,
        role: "client",
      },
      {
        name: "Agente Prueba",
        email: "agente@test.com",
        password: passwordHash,
        role: "agent",
      }
    ]);

    return NextResponse.json({
      ok: true,
      message: "Usuarios creados correctamente",
      credentials: {
        client: { email: "cliente@test.com", password: "123456" },
        agent:  { email: "agente@test.com", password: "123456" },
      }
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e }, { status: 500 });
  }
}
