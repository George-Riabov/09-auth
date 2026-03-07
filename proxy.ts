import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = Boolean(accessToken);

  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    const cookieHeader = request.headers.get("cookie") ?? "";

    try {
      const session = await checkSession(cookieHeader);

      if (session.data.success) {
        isAuthenticated = true;

        const rawSetCookie = session.headers["set-cookie"];
        const setCookie = Array.isArray(rawSetCookie)
          ? rawSetCookie
          : rawSetCookie
            ? [rawSetCookie]
            : [];

        setCookie.forEach((cookie) => {
          response.headers.append("set-cookie", cookie);
        });
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
