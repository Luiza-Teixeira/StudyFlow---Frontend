"use client";

import { userLogout } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStorage } from "@/zustand";

export default function Logout() {
  const router = useRouter();
  const { loggedUser, setLoggedUser } = useUserStorage((state) => state);

  const logoutMutation = useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      console.log("user logged out");
      setLoggedUser(null);
      router.replace("/login");
    },
    onError: (error) => {
      alert(
        "Servidor indisponível no momento. Tente novamente mais tarde. Erro: " +
          error.message,
      );
    },
  });

  const handleSubmit = (evt) => {
    evt.preventDefault();
    
    // Verificação de segurança: só tenta fazer logout na API se o usuário tiver um token válido
    if (loggedUser?.sessionToken) {
      logoutMutation.mutate(loggedUser.sessionToken);
    } else {
      // Se não tiver token, apenas limpa o Zustand e joga pro login
      setLoggedUser(null);
      router.replace("/login");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)]">
        
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Sair do StudyFlow
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Tem certeza que deseja encerrar a sua sessão?
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={logoutMutation.isPending}
            className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-lg font-bold transition-colors disabled:opacity-50"
          >
            {logoutMutation.isPending ? "Saindo..." : "Sim"}
          </button>

          <button
            type="button"
            onClick={() => router.replace("/dashboard")}
            className="w-full py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-lg font-medium transition-colors"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}