"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import SigninButton from "./SigninButton";
import Image from "next/image";
import logoGO from "../assets/GO.png"
import logoMG from "../assets/MG.png"
import logoPA from "../assets/PA.png"


const AppBar = () => {

    const { data: session } = useSession();


    if (session && session.user) {

        return (
            <>
            
                <nav className="border-gray-200 bg-gray-900 md:fixed w-full">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 md:flex-row flex-col gap-4">
                        <a className="flex items-center">
                            {session.user.siglaEstado==="GO" && <Image src={logoGO} width={100} height={32} alt="Logo Estado de Goiás" />}
                            {session.user.siglaEstado==="PA" && <Image src={logoPA} width={150} height={32} alt="Logo Estado de Minas Gerais" />}
                            {session.user.siglaEstado==="MG" && <Image src={logoMG} width={187} height={32} alt="Logo Estado do Pará" />}
                            
                        </a>
                        
                        <div className="items-center justify-between w-full md:w-auto border rounded hover:bg-slate-800 transition-colors hidden md:flex" id="navbar-user">
                            <Link className="transition-colors py-2 pl-3 pr-4 text-gray-300 hover:text-violet-400 " href={"/user/listaFormularios"}>Formulários</Link>
                        </div>

                        <div className="flex flex-row items-center justify-between w-full md:w-auto">
                                <Link className="md:hidden transition-colors p-2 mr-2 border text-gray-300 hover:text-violet-400 rounded hover:bg-slate-800" href={"/user/listaFormularios"}>Formulários</Link>
                                <SigninButton />
                        </div>

                    </div>
                </nav>

            </>
        );
    }
    else {
        return (<></>)
    }
};

export default AppBar;
