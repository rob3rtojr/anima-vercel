"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { User } from 'lucide-react'
import React from "react";
import LogoutButton from "./LogoutButton";

const SigninButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex flex-row ml-auto justify-center items-center">
        <p className="text-white text-sm pr-2 flex flex-row justify-center items-center"><User/>{session.user.nome}</p>
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
