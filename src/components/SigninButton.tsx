"use client";
import { signIn, signOut, useSession } from "next-auth/react";

import React from "react";
import LogoutButton from "./LogoutButton";
import NomeUsuario from "./NomeUsuario";

const SigninButton = () => {
  const { data: session } = useSession();

 

  if (session && session.user) {

    return (
      <div className="flex flex-row md:ml-auto justify-start md:justify-center md:items-center">
        <NomeUsuario/>
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
