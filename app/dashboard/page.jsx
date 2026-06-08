
"use client";

import { useQuery } from "@tanstack/react-query";
import { getmateria } from "@/api/materia";
import { getcategoria } from "@/api/categoria";
import "./dashboard.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function Dashboard() {
  const { data: materias = [] } = useQuery({
    queryKey: ["materias"],
    queryFn: getmateria,
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getcategoria,
  });

  return (<ProtectedRoute>
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>StudyFlow</h2>

        <ul>
  <li>
    <Link href="/dashboard">Dashboard</Link>
  </li>

  <li>
    <Link href="/materia">Matérias</Link>
  </li>

  <li>
    <Link href="/categoria">Categorias</Link>
  </li>

  <li>
    <Link href="/logout">Sair</Link>
  </li>
</ul>
      </aside>

      <main className="content">
        <h1>Dashboard</h1>

        <div className="cards">
          <div className="card">
            <h2>{materias.length}</h2>
            <p>Matérias cadastradas</p>
          </div>

          <div className="card">
            <h2>{categorias.length}</h2>
            <p>Categorias cadastradas</p>
          </div>

          <div className="card">
            <h2>0</h2>
            <p>Tarefas concluídas</p>
          </div>

          <div className="card">
            <h2>0</h2>
            <p>Tarefas no dia de hoje hojee</p>
          </div>
        </div>

        <div className="grid">
          <div className="box">
            <h3>Matérias</h3>

            {materias.map((materia) => (
              <div
                key={materia.objectId}
                className="item"
              >
                {materia.Materia}
              </div>
            ))}
          </div>

          <div className="box">
            <h3>Categorias</h3>

            {categorias.map((categoria) => (
              <div
                key={categoria.objectId}
                className="item"
              >
                <span
                  style={{
                    backgroundColor: categoria.cor,
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "10px",
                  }}
                />

                {categoria.nome}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}