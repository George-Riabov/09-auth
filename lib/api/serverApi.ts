import { cookies } from "next/headers";
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

async function getServerApi() {
  const cookieStore = await cookies();

  const cookieString = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return api.create({
    headers: {
      Cookie: cookieString,
    },
  });
}

export async function fetchNotes(params: FetchNotesParams) {
  const serverApi = await getServerApi();

  const response = await serverApi.get<NotesResponse>("/notes", {
    params,
  });

  return response.data;
}

export async function fetchNoteById(id: string) {
  const serverApi = await getServerApi();

  const response = await serverApi.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function checkSession() {
  const serverApi = await getServerApi();

  const response = await serverApi.get<SessionResponse>("/auth/session");
  return response.data;
}

export async function getMe() {
  const serverApi = await getServerApi();

  const response = await serverApi.get<User>("/users/me");
  return response.data;
}
