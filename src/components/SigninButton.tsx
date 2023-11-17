"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { User } from 'lucide-react'
import React from "react";
import LogoutButton from "./LogoutButton";

const SigninButton = () => {
  const { data: session } = useSession();

 

  if (session && session.user) {

    const extrairNomes = (nomeCompleto: string) => {
      // Divide a string do nome completo em partes usando espaço como delimitador
      const partesDoNome = nomeCompleto.split(' ');
    
      // Pega o primeiro nome
      const primeiroNome = partesDoNome[0];
    
      // Pega o segundo nome, se existir
      const segundoNome = partesDoNome.length > 1 ? partesDoNome[1] : '';
    
      // Retorna um objeto com os nomes
      return primeiroNome + ' ' + segundoNome
    } 

    return (
      <div className="flex flex-row md:ml-auto justify-start md:justify-center md:items-center">
      <p className="text-white text-sm pr-2 flex flex-row justify-center items-center"><User/> {extrairNomes(session.user.nome)}</p>
        <LogoutButton/>
      </div>
    );
  }
  return (
    <button onClick={() => signIn()} className="text-green-700 ml-auto">
      [ Login ]
    </button>
  );
};

export default SigninButton;
