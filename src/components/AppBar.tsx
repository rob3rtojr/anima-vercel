"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import SigninButton from "./SigninButton";

const AppBar = () => {

  const { data: session } = useSession();

  if (session && session.user) {

  return (
    <header className="flex gap-4 p-4 bg-gradient-to-b bg-white shadow">
      <Link className="transition-colors hover:text-blue-500" href={"/"}>
        Home Page
      </Link>
      <Link className="transition-colors hover:text-blue-500" href={"/listaFormularios"}>
        Formulários
      </Link>
      <SigninButton />
    </header>

  );
  }
  else {
    return(<></>)
  }
};

export default AppBar;
