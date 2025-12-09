import { api } from "./api";

export interface CreateCommentPayload {
  ticketId: string;
  userId: string;
  message: string;
}

export async function getComments(ticketId: string) {
  const res = await api.get(`/comments?ticketId=${ticketId}`);
  return res.data;
}

export async function addComment(
  token: string,
  comment: CreateCommentPayload
) {
  const res = await api.post("/comments", comment, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
