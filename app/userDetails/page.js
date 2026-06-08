"use client";

import { currentUser, verificationEmailRequest } from "@/api";
import { useUserStorage } from "@/zustand";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function userDetails() {
  // Busca o usuário logado no estado global (Zustand)
  const loggedUser = useUserStorage((state) => state.loggedUser);

  // A query só dispara se existir um sessionToken, evitando o erro de "null"
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => currentUser(loggedUser.sessionToken),
    enabled: !!loggedUser?.sessionToken,
  });

  const mutation = useMutation({
    mutationFn: verificationEmailRequest,
    onSuccess: () => {
      alert("Verifique a sua caixa de e-mail para validar a conta.");
    },
    onError: (error) => {
      alert("Erro ao solicitar verificação: " + error.message);
    },
  });

  // Se não estiver logado, exibe uma mensagem amigável em vez de quebrar a página
  if (!loggedUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-8">
        <p className="text-gray-700 mb-4">Você precisa estar logado para acessar esta página.</p>
        <Link href="/login" className="text-purple-700 font-bold hover:underline">
          Ir para o Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Padronizada */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-purple-700 mb-8">StudyFlow</h1>
        <nav className="flex flex-col gap-4 text-black">
          <Link href="/dashboard" className="text-left hover:text-purple-700 transition-colors">Dashboard</Link>
          <Link href="/materia" className="text-left hover:text-purple-700 transition-colors">Matérias</Link>
          <Link href="/tarefa" className="text-left hover:text-purple-700 transition-colors">Tarefas</Link>
          <Link href="/categoria" className="text-left hover:text-purple-700 transition-colors">Categorias</Link>
          <Link href="/userDetails" className="font-semibold text-purple-700">Perfil</Link>
          <Link href="/logout" className="text-red-500 mt-auto pt-4 border-t">Sair</Link>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-8">Perfil do Usuário</h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-lg">
          {isLoading ? (
            <p className="text-gray-500">Carregando seus dados...</p>
          ) : isError ? (
            <p className="text-red-500">Erro ao carregar: {error.message}</p>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-500">Nome de Usuário</label>
                <p className="text-lg font-medium text-black">{data?.username}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">E-mail</label>
                <p className="text-lg font-medium text-black">{data?.email}</p>
              </div>
              
              <button 
                onClick={() => mutation.mutate(loggedUser.email)}
                className="w-full py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-semibold transition-colors"
              >
                {mutation.isPending ? "Enviando..." : "Solicitar Verificação de E-mail"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}