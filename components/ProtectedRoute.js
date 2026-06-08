"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStorage } from "@/zustand";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  const loggedUser = useUserStorage(
    (state) => state.loggedUser
  );

  useEffect(() => {
    if (!loggedUser) {
      router.replace("/login");
    }
  }, [loggedUser, router]);

  if (!loggedUser) {
    return null;
  }

  return children;
}