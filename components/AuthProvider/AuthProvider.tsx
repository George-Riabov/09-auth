"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

const privateRoutes = ["/notes", "/profile"];

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function validateSession() {
      try {
        const session = await checkSession();

        if (session.success) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();

          const isPrivateRoute = privateRoutes.some((route) =>
            pathname.startsWith(route),
          );

          if (isPrivateRoute) {
            router.push("/sign-in");
            return;
          }
        }
      } catch {
        clearIsAuthenticated();

        const isPrivateRoute = privateRoutes.some((route) =>
          pathname.startsWith(route),
        );

        if (isPrivateRoute) {
          router.push("/sign-in");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    }

    validateSession();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
