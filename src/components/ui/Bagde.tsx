import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  color?: "green" | "yellow" | "red" | "gray";
}

export function Badge({ children, color = "gray" }: Props) {
  const colors: Record<string, string> = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={clsx("px-2 py-1 text-xs rounded-full", colors[color])}>
      {children}
    </span>
  );
}
