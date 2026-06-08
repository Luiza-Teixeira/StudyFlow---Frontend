"use client";

import { userLogin } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStorage } from "@/zustand";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const setLoggedUser = useUserStorage((state) => state.setLoggedUser);
  
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      console.log("user data received from back4app:", user, data);
      setLoggedUser(data);
      router.replace("/dashboard");
    },
    onError: (error) => {
      alert("Erro de Login. Erro: " + error.message);
    },
  });

  const handleChange = (evt) => {
    setUser({ ...user, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!user.username || !user.password) {
      alert("Preencha todos os campos");
      return;
    }
    loginMutation.mutate(user);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)]">
        
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Login
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Faça login para acessar o sistema
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-gray-700">
              Nome do Usuário
            </label>

            <input
              name="username"
              value={user.username}
              onChange={handleChange}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-700">
              Senha
            </label>

            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>
          <div className="mb-6 text-right">
  <Link
    href="/forgotPassword"
    className="text-sm text-purple-700 hover:underline"
  >
    Esqueceu sua senha?
  </Link>
</div>



          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-lg font-bold transition-colors mb-3 disabled:opacity-50"
          >
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => router.replace("/")}
            className="w-full py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          
          <div className="mt-6 text-center">
          <span className="text-gray-600">
           Não possui cadastro?{" "}
          </span>

         <Link href="/signup"className="text-purple-700 font-semibold hover:underline">    Cadastre-se  </Link> </div>
        </form>
      </div>
    </div>
  );
}