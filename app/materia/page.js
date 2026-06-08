"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addmateria, deletemateria, getmateria, updatemateria } from "@/api/materia";
import Link from "next/link";
import { create } from "zustand";
import ProtectedRoute from "@/components/ProtectedRoute";

// O mesmo estado global que usamos na tela de Categorias
const useAppStore = create((set) => ({
  // Pode mudar para:
  usuarioLogado: "Usuário Teste",

  // Ou deixar apenas vazio por enquanto:
  usuarioLogado: "",
}));

export default function ListaDemateria() {
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  // O período padrão que o seu colega configurou na API
  const [novoPeriodo, setNovoPeriodo] = useState("1"); 

  const usuarioLogado = useAppStore((state) => state.usuarioLogado);
  const queryClient = useQueryClient();

  const { data: materias = [], isError, error, isLoading } = useQuery({
    queryKey: ["materia"],
    queryFn: getmateria,
  });

  const addMutation = useMutation({
    mutationFn: addmateria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materia"] });
      fecharModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatemateria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materia"] });
      fecharModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletemateria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materia"] });
    },
  });

  const fecharModal = () => {
    setModalAberto(false);
    setEditando(null);
    setNovoNome("");
    setNovoPeriodo("1");
  };

  const handleSalvar = () => {
    if (!novoNome.trim()) {
      alert("Digite um nome para a matéria.");
      return;
    }

    if (editando) {
      updateMutation.mutate({
        ...editando,
        nome: novoNome,
        periodo: novoPeriodo,
      });
    } else {
      // A função addmateria da API espera apenas o nome da matéria (descrição)
      addMutation.mutate(novoNome);
    }
  };

  const handleRemoverMateria = (materia) => {
    if (window.confirm(`Deseja excluir a matéria "${materia.nome}"?`)) {
      deleteMutation.mutate(materia);
    }
  };

  return (
    // <ProtectedRoute>  <-- Lembre-se de descomentar antes de entregar!
      <div className="min-h-screen bg-gray-100 flex">
        
        {/* Sidebar idêntica à de Categorias */}
        <aside className="w-64 bg-white border-r p-6 flex flex-col">
          <h1 className="text-2xl font-bold text-purple-700 mb-2">StudyFlow</h1>
          <p className="text-sm text-gray-500 mb-8 pb-4 border-b">
            Olá, {usuarioLogado}!
          </p>
          <nav className="flex flex-col gap-4 text-black">
            <Link href="/dashboard" className="text-left hover:text-purple-700 transition-colors">Dashboard</Link>
            <Link href="/materia" className="text-left font-semibold text-purple-700">Matérias</Link> {/* Matérias em destaque */}
            <Link href="/tarefa" className="text-left hover:text-purple-700 transition-colors">Tarefas</Link>
            <Link href="/categoria" className="text-left hover:text-purple-700 transition-colors">Categorias</Link>
            <Link href="/userDetails" className="text-left hover:text-purple-700 transition-colors">Perfil</Link>
            <Link href="/logout" className="text-red-500 mt-auto pt-4 border-t">Sair</Link>
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-700">Matérias</h1>
            <button
              onClick={() => {
                fecharModal();
                setModalAberto(true);
              }}
              className="bg-purple-700 hover:bg-purple-800 transition-colors text-white px-4 py-2 rounded-lg"
            >
              + Nova Matéria
            </button>
          </div>

          {isError && (
            <h3 className="text-red-500 font-medium mt-4">Erro: {error.message}</h3>
          )}

          <div className="mt-8 space-y-4">
            {isLoading ? (
              <p className="text-gray-500">Carregando matérias...</p>
            ) : materias.length === 0 ? (
              <p className="text-gray-500">Nenhuma matéria cadastrada ainda.</p>
            ) : (
              materias.map((materia) => (
                <div
                  key={materia.objectId}
                  className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* Um ícone de livro simples para dar um charme visual */}
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                      📚
                    </div>
                    <div className="flex flex-col">
                      <span className="text-black font-medium">{materia.nome}</span>
                      <span className="text-sm text-gray-500">{materia.periodo}º período</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditando(materia);
                        setNovoNome(materia.nome);
                        setNovoPeriodo(materia.periodo);
                        setModalAberto(true);
                      }}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 transition-colors text-black rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleRemoverMateria(materia)}
                      disabled={deleteMutation.isPending}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 transition-colors text-white rounded disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="mt-6 text-gray-600">
            Total de matérias: {materias?.length || 0}
          </p>

          {/* Modal Idêntico ao de Categorias */}
          {modalAberto && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold text-black mb-4">
                  {editando ? "Editar Matéria" : "Nova Matéria"}
                </h2>

                <input
                  type="text"
                  placeholder="Nome da matéria"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full border p-2 rounded mb-4 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                {editando && (
                  <input
                    type="text"
                    placeholder="Período"
                    value={novoPeriodo}
                    onChange={(e) => setNovoPeriodo(e.target.value)}
                    className="w-full border p-2 rounded mb-6 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={fecharModal}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSalvar}
                    disabled={addMutation.isPending || updateMutation.isPending}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                  >
                    {(addMutation.isPending || updateMutation.isPending) ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    // </ProtectedRoute>
  );
}