interface CommentProps {
  authorName?: string;
  message: string;
  createdAt: string;
}

interface CommentListProps {
  comments: CommentProps[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-2">
      {comments.map((c, i) => (
        <div key={i} className="border rounded p-2 text-sm bg-gray-50">
          <p className="font-semibold">{c.authorName || "Usuario"}</p>
          <p>{c.message}</p>
          <p className="text-xs text-gray-500">
            {new Date(c.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
