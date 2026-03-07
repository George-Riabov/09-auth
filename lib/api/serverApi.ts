import axios from "axios";
import { cookies } from "next/headers";
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

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

function createServerApi(cookieHeader?: string) {
  return axios.create({
    baseURL,
    withCredentials: true,
    headers: cookieHeader
      ? {
          Cookie: cookieHeader,
        }
      : undefined,
  });
}

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

async function getServerApi(cookieHeader?: string) {
  const finalCookieHeader = cookieHeader ?? (await getCookieHeader());
  return createServerApi(finalCookieHeader);
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

export async function checkSession(cookieHeader?: string) {
  const serverApi = await getServerApi(cookieHeader);

  const response = await serverApi.get<SessionResponse>("/auth/session");

  return response;
}

export async function getMe() {
  const serverApi = await getServerApi();

  const response = await serverApi.get<User>("/users/me");
  return response.data;
}
