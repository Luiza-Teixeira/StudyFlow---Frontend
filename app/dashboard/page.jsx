"use client";

import { useQuery } from "@tanstack/react-query";
import { getmateria } from "@/api/materia";
import { getcategoria } from "@/api/categoria";
import { gettarefa } from "@/api/tarefa";
import Link from "next/link";
import { create } from "zustand";

const useAppStore = create(() => ({
  usuarioLogado: "Usuário",
}));

export default function Dashboard() {
  const usuarioLogado = useAppStore(
    (state) => state.usuarioLogado
  );

  const { data: materias = [], isLoading: carregandoMaterias } =
    useQuery({
      queryKey: ["materia"],
      queryFn: getmateria,
    });

  const {
    data: categorias = [],
    isLoading: carregandoCategorias,
  } = useQuery({
    queryKey: ["categoria"],
    queryFn: getcategoria,
  });

  const {
    data: tarefas = [],
  } = useQuery({
    queryKey: ["tarefa"],
    queryFn: gettarefa,
  });

  console.log("TAREFAS:", tarefas);

  const tarefasConcluidas = tarefas.filter(
    (tarefa) => tarefa.status === "Concluída"
  ).length;

  const hoje = new Date().toISOString().split("T")[0];

  const tarefasHoje = tarefas.filter((tarefa) => {
    if (!tarefa.data_entrega) return false;

    try {
      let dataTarefa = "";

      if (
        typeof tarefa.data_entrega === "object" &&
        tarefa.data_entrega.iso
      ) {
        dataTarefa = tarefa.data_entrega.iso.split("T")[0];
      } else {
        dataTarefa = new Date(
          tarefa.data_entrega
        )
          .toISOString()
          .split("T")[0];
      }

      return dataTarefa === hoje;
    } catch {
      return false;
    }
  }).length;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-purple-700 mb-2">
          StudyFlow
        </h1>

        <p className="text-sm text-gray-500 mb-8 pb-4 border-b">
          Olá, {usuarioLogado}!
        </p>

        <nav className="flex flex-col gap-4 text-black">
          <Link
            href="/dashboard"
            className="font-semibold text-purple-700"
          >
            Dashboard
          </Link>

          <Link
            href="/materia"
            className="hover:text-purple-700"
          >
            Matérias
          </Link>

          <Link
            href="/tarefa"
            className="hover:text-purple-700"
          >
            tarefas
          </Link>

          <Link
            href="/categoria"
            className="hover:text-purple-700"
          >
            Categorias
          </Link>

          <Link
            href="/userDetails"
            className="hover:text-purple-700"
          >
            Perfil
          </Link>

          <Link
            href="/logout"
            className="text-red-500 mt-auto pt-4 border-t"
          >
            Sair
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-8">
          Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <h2 className="text-3xl font-bold text-gray-800">
              {materias.length}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Matérias cadastradas
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h2 className="text-3xl font-bold text-gray-800">
              {categorias.length}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Categorias cadastradas
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <h2 className="text-3xl font-bold text-gray-800">
              {tarefasConcluidas}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Tarefas concluídas
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <h2 className="text-3xl font-bold text-gray-800">
              {tarefasHoje}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Tarefas para hoje
            </p>
          </div>
        </div>

        {/* Listas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-purple-500 mb-4 pb-2 border-b">
              Matérias
            </h3>

            {carregandoMaterias ? (
              <p>Carregando...</p>
            ) : (
              materias.map((materia) => (
                <div
                  key={materia.objectId}
                  className="flex items-center gap-3 p-2"
                >
                  <span>📚</span>
                  <span>{materia.nome}</span>
                </div>
              ))
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-500 mb-4 pb-2 border-b">
              Categorias
            </h3>

            {carregandoCategorias ? (
              <p>Carregando...</p>
            ) : (
              categorias.map((categoria) => (
                <div
                  key={categoria.objectId}
                  className="flex items-center gap-3 p-2"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      categoria.cor || "bg-gray-400"
                    }`}
                  />
                  <span>{categoria.nome}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}