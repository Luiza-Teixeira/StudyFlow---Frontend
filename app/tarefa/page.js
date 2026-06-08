"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addtarefa,
  gettarefa,
  updatetarefa,
  deletetarefa,
} from "@/api/tarefa";

import { useUserStorage } from "@/zustand";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TarefasPage() {
  const usuarioLogado = useUserStorage(
    (state) => state.loggedUser?.username || "Usuário"
  );

  const queryClient = useQueryClient();

  const [modalAberto, setModalAberto] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [dataEntrega, setDataEntrega] = useState("");

  const [tarefaEditando, setTarefaEditando] =
    useState(null);

  const { data: tarefas = [] } = useQuery({
    queryKey: ["tarefa"],
    queryFn: gettarefa,
  });

  const addMutation = useMutation({
    mutationFn: addtarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tarefa"],
      });

      fecharModal();
    },
  });

  const editMutation = useMutation({
    mutationFn: updatetarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tarefa"],
      });

      fecharModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletetarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tarefa"],
      });
    },
  });

  function fecharModal() {
    setModalAberto(false);
    setTarefaEditando(null);

    setTitulo("");
    setStatus("Pendente");
    setDataEntrega("");
  }

  function salvarTarefa() {
    if (!titulo.trim()) {
      alert("Digite um título");
      return;
    }

    if (!dataEntrega) {
      alert("Informe a data");
      return;
    }

    const payload = {
      titulo,
      status,
      data_entrega: new Date(dataEntrega).toISOString(),
    };

    if (tarefaEditando) {
      editMutation.mutate({
        objectId: tarefaEditando.objectId,
        ...payload,
      });
    } else {
      addMutation.mutate(payload);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">

        <aside className="w-64 bg-white border-r p-6 flex flex-col">
          <h1 className="text-2xl font-bold text-purple-700 mb-2">
            StudyFlow
          </h1>

          <p className="text-sm text-gray-500 mb-8 pb-4 border-b">
            Olá, {usuarioLogado}!
          </p>

          <nav className="flex flex-col gap-4 text-black">
            <Link href="/dashboard">
              Dashboard
            </Link>

            <Link href="/materia">
              Matérias
            </Link>

            <Link
              href="/tarefa"
              className="font-semibold text-purple-700"
            >
              Tarefas
            </Link>

            <Link href="/categoria">
              Categorias
            </Link>

            <Link href="/userDetails">
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

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-700">
              Tarefas
            </h1>

            <button
              onClick={() => setModalAberto(true)}
              className="bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              + Nova Tarefa
            </button>
          </div>

          <div className="mt-8 space-y-4">

            {tarefas.map((tarefa) => (
              <div
                key={tarefa.objectId}
                className="bg-white p-4 rounded-lg shadow flex justify-between"
              >
                <div>
                  <h3 className="font-bold text-black">
                    {tarefa.titulo}
                  </h3>

                  <p className="text-gray-500">
                    Status: {tarefa.status}
                  </p>

                  <p className="text-gray-500">
                    Entrega:
                    {" "}
                    {new Date(
                      tarefa.data_entrega.iso
                    ).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex gap-2">

                  <button
                    className="bg-yellow-400 px-3 py-1 rounded"
                    onClick={() => {
                      setTarefaEditando(tarefa);

                      setTitulo(tarefa.titulo);

                      setStatus(tarefa.status);

                      setDataEntrega(
                        tarefa.data_entrega.iso
                          .split("T")[0]
                      );

                      setModalAberto(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      if (
                        confirm(
                          "Deseja excluir esta tarefa?"
                        )
                      ) {
                        deleteMutation.mutate(tarefa);
                      }
                    }}
                  >
                    Excluir
                  </button>

                </div>
              </div>
            ))}

          </div>

          {modalAberto && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

              <div className="bg-white p-6 rounded-lg w-96">

                <h2 className="text-xl font-bold mb-4">
                  {tarefaEditando
                    ? "Editar Tarefa"
                    : "Nova Tarefa"}
                </h2>

                <input
                  type="text"
                  placeholder="Título"
                  value={titulo}
                  onChange={(e) =>
                    setTitulo(e.target.value)
                  }
                  className="w-full border p-2 rounded mb-3"
                />

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="w-full border p-2 rounded mb-3"
                >
                  <option>Pendente</option>
                  <option>Em andamento</option>
                  <option>Concluída</option>
                </select>

                <input
                  type="date"
                  value={dataEntrega}
                  onChange={(e) =>
                    setDataEntrega(e.target.value)
                  }
                  className="w-full border p-2 rounded mb-4"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={fecharModal}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={salvarTarefa}
                    className="bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Salvar
                  </button>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </ProtectedRoute>
  );
}