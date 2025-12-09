interface Props {
  children: React.ReactNode;
}

export function Card({ children }: Props) {
  return <div className="border rounded-lg p-4 shadow-sm bg-white">{children}</div>;
}
