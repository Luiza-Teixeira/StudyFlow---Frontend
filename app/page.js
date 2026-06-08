import { redirect } from 'next/navigation';

export default function Home() {
  // Isso faz com que, ao acessar a página inicial (/), 
  // o usuário seja enviado automaticamente para a tela de login.
  redirect('/login');
}