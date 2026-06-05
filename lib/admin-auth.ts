import { createHash } from "crypto";
import { cookies } from "next/headers";

const cookieName = "rola_admin_session";

function getCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "rola",
    password: process.env.ADMIN_PASSWORD ?? "9060630"
  };
}

function createToken(username: string, password: string) {
  return createHash("sha256")
    .update(`${username}:${password}:rola-boutique-admin`)
    .digest("hex");
}

export async function isAdminAuthenticated() {
  const { username, password } = getCredentials();

  if (!password) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value === createToken(username, password);
}

export async function setAdminSession() {
  const { username, password } = getCredentials();
  const cookieStore = await cookies();

  cookieStore.set(cookieName, createToken(username, password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/admin"
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/admin"
  });
}

export function validateAdminLogin(username: string, password: string) {
  const credentials = getCredentials();
  return Boolean(credentials.password) && username === credentials.username && password === credentials.password;
}
