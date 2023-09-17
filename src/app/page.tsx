'use client'

import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react";
import LoadImage from "../components/elements/LoadImage";

import { useEffect, useState } from "react";
import { api } from '@/lib/api';

// type DadosEstado = {
//   sigla: string,
//   descricao: string,
//   secretaria: string,
//   secretariaAbrebiado: string,
//   isLoading: boolean
// }

type Estado = {
  sigla: string,
  descricao: string,
  isLoading: boolean
}

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession();
  const [estados, setEstados] = useState<Estado[]>([])

  if (session && session.user) {
    router.push(`/user/listaFormularios`)
  }

  // const dadosEstado: DadosEstado[] = [
  //   {
  //     "sigla": "GO",
  //     "descricao": "Goiás",
  //     "secretaria": "Secretaria de Estado da Educação de Goiás",
  //     "secretariaAbrebiado": "SEDUC-GO",
  //     "isLoading": false
  //   },
  //   {
  //     "sigla": "MG",
  //     "descricao": "Minas Gerais",
  //     "secretaria": "Secretaria de Estado da Educação de Minas Gerais",
  //     "secretariaAbrebiado": "SEE-MG",
  //     "isLoading": false
  //   },
  //   {
  //     "sigla": "PA",
  //     "descricao": "Pará",
  //     "secretaria": "Secretaria de Estado da Educação do Pará",
  //     "secretariaAbrebiado": "SEDUC-PA",
  //     "isLoading": false
  //   },
  // ]

  useEffect(() => {

    const fetchOptions = async () => {
      try {
        
        const result = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/estados`)
        const estadosRota: any[] = result.data

        console.log(result)

        const est: Estado[] = estadosRota.map(e=>({
          sigla: e.sigla,
          descricao: e.nome,
          isLoading: false
        }))
        
        setEstados(est)

      } catch (error) {
        console.log(error);
      }
    };
    //fetchOptions();


  }, [])

  function handleClick(sigla: string) {

    const index = estados.findIndex((e) => e.sigla === sigla)
    if (index >= 0) {
      const estadosCopia = [...estados];
      estadosCopia[index].isLoading = true
      setEstados(estadosCopia)
    }
    router.push(`/auth/signin?estado=${sigla}`)
  }

  return <div className={"flex md:flex-row flex-col justify-center items-center w-full h-screen bg-slate-800 gap-1"}>
    {
      <div className={"text-white"}>
        Período para preenchimento encerrado.
      </div>
      // estados.map((e, index) => {
      //   return (
      //     <button key={index} onClick={() => handleClick(e.sigla)} className="w-full">
      //       <div className="flex flex-col rounded-md shadow-sm h-32 bg-violet-500 p-4 hover:bg-violet-700 text-white transition-all m-4 justify-center items-center">
      //         <div className="text-2xl flex flex-row justify-center items-center w-full">
      //           {e.isLoading && <LoadImage />}
      //           {e.descricao}
      //         </div>
      //       </div>
      //     </button>
      //   )
      // })
    }
  </div >
}
