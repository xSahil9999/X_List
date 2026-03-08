import { cookies } from "next/headers";

const TOKEN_KEY = "x_list_token";

export async function getSessionToken() {
  const store = await cookies();
  return store.get(TOKEN_KEY)?.value;
}

export async function setSessionToken(token: string) {
  const store = await cookies();
  store.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 5
  });
}

export async function clearSessionToken() {
  const store = await cookies();
  store.delete(TOKEN_KEY);
}
