import { connectDB } from "./db";
import { Ticket } from "./models/Ticket";


export async function autoCloseOldTickets(): Promise<void> {
  await connectDB();

 
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

  const ticketsToClose = await Ticket.find({
    status: { $ne: "closed" },
    updatedAt: { $lt: fiveDaysAgo },
  });

  if (ticketsToClose.length === 0) {
    console.log("No hay tickets antiguos para cerrar.");
    return;
  }

  for (const ticket of ticketsToClose) {
    ticket.status = "closed";
    ticket.updatedAt = new Date();
    await ticket.save();
  }

  console.log(`Tickets cerrados automáticamente: ${ticketsToClose.length}`);
}
