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
            
                <nav className="border-gray-200 bg-gray-900 lg:fixed w-full">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <a className="flex items-center">
                            {session.user.siglaEstado==="GO" && <Image src={logoGO} width={100} height={32} alt="Logo Estado de Goiás" />}
                            {session.user.siglaEstado==="PA" && <Image src={logoPA} width={150} height={32} alt="Logo Estado de Minas Gerais" />}
                            {session.user.siglaEstado==="MG" && <Image src={logoMG} width={187} height={32} alt="Logo Estado do Pará" />}
                            
                        </a>
                        <div className="flex items-center md:order-2">

                            <SigninButton />

                        </div>
                        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
                                <li>
                                    <Link className="transition-colors block py-2 pl-3 pr-4 text-white hover:text-violet-400 rounded  md:p-0" href={"/user/listaFormularios"}>Formulários</Link>
                                </li>

                            </ul>
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
