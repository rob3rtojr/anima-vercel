'use client'

import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";
import LoadImage from "../components/elements/LoadImage";

import { useEffect, useState } from "react";

type DadosEstado = {
  sigla: string,
  descricao: string,
  secretaria: string,
  secretariaAbrebiado: string,
  isLoading: boolean
}

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession();
  const [estados, setEstados] = useState<DadosEstado[]>([])

  if (session && session.user) {
    router.push(`/user/listaFormularios`)
  }

  const dadosEstado: DadosEstado[] = [
    {
      "sigla": "GO",
      "descricao": "Goiás",
      "secretaria": "Secretaria de Estado da Educação de Goiás",
      "secretariaAbrebiado": "SEDUC-GO",
      "isLoading": false
    },
    {
      "sigla": "MG",
      "descricao": "Minas Gerais",
      "secretaria": "Secretaria de Estado da Educação de Minas Gerais",
      "secretariaAbrebiado": "SEE-MG",
      "isLoading": false
    },
    {
      "sigla": "PA",
      "descricao": "Pará",
      "secretaria": "Secretaria de Estado da Educação do Pará",
      "secretariaAbrebiado": "SEDUC-PA",
      "isLoading": false
    },
  ]

  useEffect(() => {

    setEstados(dadosEstado)

  }, [])

  function handleClick(sigla: string) {

    const index = dadosEstado.findIndex((e) => e.sigla === sigla)
    if (index >= 0) {
      dadosEstado[index].isLoading = true
      setEstados(dadosEstado)
    }
    router.push(`/auth/signin?estado=${sigla}`)
  }

  return <div className={"flex md:flex-row flex-col justify-center items-center w-full h-screen bg-slate-800 gap-1"}>

    {
      estados.map((e, index) => {
        return (
          <button key={index} onClick={() => handleClick(e.sigla)} className="w-full">
            <div className="flex flex-col rounded-md shadow-sm h-32 bg-violet-500 p-4 hover:bg-violet-700 text-white transition-all m-4 justify-center items-center">
              <div className="text-2xl flex flex-row justify-center items-center w-full">
                {e.isLoading && <LoadImage />}
                {e.descricao}
              </div>
            </div>
          </button>
        )
      })
    }
  </div >
}
