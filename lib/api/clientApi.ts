import { api } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface SessionResponse {
  success: boolean;
}

export async function fetchNotes(params: FetchNotesParams) {
  const response = await api.get<NotesResponse>("/notes", {
    params,
  });

  return response.data;
}

export async function fetchNoteById(id: string) {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(
  note: Omit<Note, "id" | "createdAt" | "updatedAt">,
) {
  const response = await api.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(id: string) {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function register(data: { email: string; password: string }) {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
}

export async function login(data: { email: string; password: string }) {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function checkSession() {
  const response = await api.get<SessionResponse>("/auth/session");
  return response.data;
}

export async function getMe() {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(data: { username: string }) {
  const response = await api.patch<User>("/users/me", data);
  return response.data;
}
