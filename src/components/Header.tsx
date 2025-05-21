"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SigninButton from "./SigninButton";
import Image from "next/image";
import logoGO from "../assets/GO.png"
import logoMG from "../assets/MG.png"
import logoPA from "../assets/PA.png"
import logoBA from "../assets/BA.png"
import { CircleHelpIcon, Menu, X, CopyCheck } from 'lucide-react';
import NomeUsuario from "./NomeUsuario";
import LogoutButton from "./LogoutButton";
import AjudaModal from "./AjudaModal";

const AppBar = () => {

    const { data: session } = useSession();

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [clickedMenu, setClickedMenu] = useState(true);
    const [isAjudaOpen, setIsAjudaOpen] = useState<boolean>(false);

    useEffect(() => {
        function handleScroll() {
            const currentScrollTop = window.scrollY;

            if (currentScrollTop > lastScrollTop) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollTop(currentScrollTop);
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);

    function handleMenuClick() {
        setClickedMenu(!clickedMenu)
    }

    if (session && session.user) {

        return (
            <>

                {/* <nav className={`border-gray-200 bg-gray-900 hidden md:block md:fixed w-full transition-all duration-300`} >
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 md:flex-row flex-col gap-4">
                        <a className="flex items-center">
                            {session.user.siglaEstado === "GO" && <Image src={logoGO} width={100} height={32} alt="Logo Estado de Goiás" />}
                            {session.user.siglaEstado === "PA" && <Image src={logoPA} width={150} height={32} alt="Logo Estado de Minas Gerais" />}
                            {session.user.siglaEstado === "MG" && <Image src={logoMG} width={187} height={32} alt="Logo Estado do Pará" />}

                        </a>

                        <div className="items-center justify-between w-full md:w-auto border rounded hover:bg-slate-800 transition-colors hidden md:flex" id="navbar-user">
                            <Link className="transition-colors py-2 pl-3 pr-4 text-gray-300 hover:text-violet-400 " href={"/user/listaFormularios"}>Formulários</Link>
                        </div>

                        <div className="flex flex-row items-center justify-between w-full md:w-auto">
                            <Link className="md:hidden transition-colors p-2 mr-2 border text-gray-300 hover:text-violet-400 rounded hover:bg-slate-800" href={"/user/listaFormularios"}>Formulários</Link>
                            <SigninButton />
                        </div>

                    </div>
                </nav> */}

                <nav className={`fixed top-0 border-gray-200 bg-gray-900 block w-full transition-all duration-300 ${isVisible ? 'block' : 'hidden'}`} >
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pr-4 pl-4 md:pr-8 md:pl-8 flex-row">
                        <a className="flex items-center">
                            {session.user.siglaEstado === "GO" && <Image src={logoGO} width={100} height={32} alt="Logo Estado de Goiás" />}
                            {session.user.siglaEstado === "PA" && <Image src={logoPA} width={150} height={32} alt="Logo Estado de Minas Gerais" />}
                            {session.user.siglaEstado === "MG" && <Image src={logoMG} width={187} height={32} alt="Logo Estado do Pará" />}
                            {session.user.siglaEstado === "BA" && <Image src={logoBA} width={126} height={32} alt="Logo Estado da Bahia" />}
                        </a>
                        <div>
                            <div className="flex flex-row items-center">
                                <NomeUsuario />
                                <Menu className={`text-white cursor-pointer transition-all duration-300 ${clickedMenu ? 'hidden' : 'block'}`} onClick={() => handleMenuClick()} />
                                {/* <X className={`text-white cursor-pointer transition-all duration-300 ${!clickedMenu ? 'hidden' : 'block'}`} onClick={() => handleMenuClick()} /> */}
                            </div>
                        </div>
                    </div>
                    <div className={`flex justify-center w-full bg-gray-700 transition-all duration-500 ${clickedMenu ? 'block' : 'hidden'}`}>
                        <div className={`flex justify-center max-w-screen-xl border-gray-200 w-full `} >
                            <div className="flex flex-row justify-end items-center pl-4 pr-4 w-full">

                                <Link className="flex items-center gap-2 transition-colors ml-2 p-2 mr-2 text-violet-400  rounded hover:bg-violet-700 hover:text-white" href={"/user/listaFormularios"}><CopyCheck />Questionários</Link>
                                <span className="text-gray-500">|</span>
                                <div onClick={()=>setIsAjudaOpen(true)} className="flex flex-row items-center gap-2 transition-colors ml-2 p-2 mr-2 text-violet-400  rounded hover:bg-violet-700 hover:text-white cursor-pointer"><CircleHelpIcon/> Ajuda</div>
                                <span className="text-gray-500">|</span>
                                <div><LogoutButton /></div>
                            </div>
                        </div>
                    </div>
                </nav>
                <AjudaModal
                    setIsModalOpen={setIsAjudaOpen}
                    isModalOpen={isAjudaOpen}
                    tipoAjuda={'geral'}
                /> 

            </>
        );
    }
    else {
        return (<></>)
    }
};

export default AppBar;
