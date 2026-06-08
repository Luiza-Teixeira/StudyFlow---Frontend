"use client";

import { userSignUp } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStorage } from "@/zustand";

export default function SignUp() {
  const router = useRouter();
  const setLoggedUser = useUserStorage((state) => state.setLoggedUser);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    nascimento: "",
    password: "",
    confirmPassword: "",
  });

  const [erroSenha, setErroSenha] = useState(false);

  const signUpMutation = useMutation({
    mutationFn: userSignUp,
    onSuccess: (data) => {
      setLoggedUser({ ...formData, ...data });
      router.replace("/dashboard");
    },
    onError: (error) => {
      alert("Erro ao cadastrar: " + error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validação em tempo real das senhas
    if (name === "confirmPassword" || name === "password") {
      setErroSenha(name === "confirmPassword" ? value !== formData.password : formData.confirmPassword !== value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (erroSenha) return alert("As senhas não conferem.");
    signUpMutation.mutate({ 
        username: formData.username, 
        email: formData.email, 
        password: formData.password 
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)]">
        
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">StudyFlow</h1>
        <h2 className="text-xl font-semibold text-center text-purple-600 mb-2">Crie a sua conta!</h2>
        <p className="text-center text-gray-500 mb-8">Registe-se para começar a estudar</p>

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div className="mb-4">
            <input name="username" placeholder="Nome de usuário" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-500 text-black" />
          </div>

          {/* Email */}
          <div className="mb-4">
            <input name="email" type="email" placeholder="E-mail" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-500 text-black" />
          </div>

          {/* Data Nascimento */}
          <div className="mb-4">
            <input name="nascimento" type="date" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-500 text-gray-400" />
          </div>

          {/* Senha */}
          <div className="mb-4">
            <input name="password" type="password" placeholder="Senha" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-500 text-black" />
          </div>

          {/* Confirmação Senha */}
          <div className="mb-6">
            <input 
              name="confirmPassword" 
              type="password" 
              placeholder="Confirmar senha" 
              onChange={handleChange} 
              className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 ${erroSenha ? "border-red-500 ring-red-100" : "focus:border-purple-500"} text-black`} 
            />
            {erroSenha && <p className="text-red-500 text-sm mt-1">As senhas não conferem.</p>}
          </div>

          <button type="submit" className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold transition-colors">
            Registar
          </button>
        </form>
      </div>
    </div>
  );
}