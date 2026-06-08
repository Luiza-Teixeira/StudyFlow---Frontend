"use client";

import { requestPasswordReset } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      console.log("user data received from back4app:", data);
      alert("Verifique o seu e-mail para resetar a sua senha.");
      router.replace("/");
    },
    onError: (error) => {
      alert("Erro de Esqueci a minha senha. Erro: " + error.message);
    },
  });

  const handleChange = (evt) => {
    setEmail(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!email) {
      alert("Preencha o seu e-mail.");
      return;
    }
    mutation.mutate(email);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)]">
        
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Resetar Senha
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Informe seu e-mail para recuperação
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">
              E-mail
            </label>

            <input
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-lg font-bold transition-colors mb-3 disabled:opacity-50"
          >
            {mutation.isPending ? "Enviando..." : "Enviar"}
          </button>

          <button
            type="button"
            onClick={() => router.replace("/")}
            className="w-full py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-lg font-medium transition-colors"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}