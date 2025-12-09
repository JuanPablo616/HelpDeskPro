import { Card } from "./ui/Card";
import { Badge } from "./ui/Bagde";
import { Button } from "./ui/Button";

interface TicketCardProps {
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  onViewDetail: () => void;
}

export function TicketCard({
  title,
  status,
  priority,
  createdAt,
  onViewDetail,
}: TicketCardProps) {
  return (
    <Card>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div className="flex gap-2 mb-2">
        <Badge color={status === "closed" ? "green" : "yellow"}>{status}</Badge>
        <Badge color={priority === "high" ? "red" : "gray"}>{priority}</Badge>
      </div>
      <p className="text-xs text-gray-500 mb-2">
        Creado: {new Date(createdAt).toLocaleString()}
      </p>
      <Button size="sm" onClick={onViewDetail}>
        Ver detalle
      </Button>
    </Card>
  );
}
