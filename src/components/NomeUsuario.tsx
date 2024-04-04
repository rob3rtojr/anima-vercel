"use client";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export default function NomeUsuario() {

    const { data: session } = useSession();

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

    if (session) {

        return (
            <p className="text-white text-sm pr-2 flex flex-row justify-center items-center gap-1"><User /> {extrairNomes(session.user.nome)}</p>
        )
    }else {
        return(<p></p>)
    }
}