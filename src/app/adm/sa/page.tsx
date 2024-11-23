'use client'
import Button from "@/components/elements/Button"
import Combo from "@/components/elements/Combo"
import { Card } from "@/components/formulario/Card/page"
import { CardContent, CardHeader } from "@/components/ui/card"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EstadoCard from "./_components/estado-card"

type QuantitativoEstado = {
    id: number
    sigla: string,
    nome: string,
    total: number,
    quantitativo: Quantitativo[]
}

type Quantitativo = {
    createdAt: string,
    count: number,
}

export default function Adm() {
    //    const [estados, setEstados] = useState<Estado[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [estados, setEstados] = useState<QuantitativoEstado[]>();
    const [formularioId, setFormularioId] = useState<string>("0");
    
    
    const [filtroInicialFormulario, setFiltroInicialFormulario] = useState<string>("");


    useEffect(() => {

        setFiltroInicialFormulario("todos")

    }, [])

   const handleSelectFormulario = (selectedOption: string) => {
        setFormularioId(selectedOption)
    }    

    const handleSubmit = async () => {
        setIsLoading(true)
        const response = await api.get(`/quantitativosa/${formularioId}`)
        setEstados(response.data)
        setIsLoading(false)
    }

    const handleClear = async () => {
        setFiltroInicialFormulario("todos")
        setFormularioId("0")
    }    

    return (
        <>
            <div className={"flex md:flex-col flex-col justify-start w-full h-screen bg-slate-800 gap-1"}>
                <div className="bg-slate-900 text-white h-10 w-full text-center text-2xl">Acompanhamento dos questionários sem autenticação</div>

                <div className="ml-8 mr-8 mb-8">
                    
                    <div className="flex flex-row justify-between w-full gap-2 pt-4">
                        <div className="w-full"><Combo labelText='Formulário Autenticado' idRota="tipoFormulariosNaoAutenticados" idFiltro={filtroInicialFormulario} onSelect={handleSelectFormulario} idSelecionado={formularioId} /></div>
                    </div>

                    <div className="flex flex-row items-center pt-8 gap-2">
                        <Button isLoading={isLoading} onClick={handleSubmit} >Filtrar</Button>
                        <Button isLoading={false} onClick={handleClear} >Limpar</Button>
                    </div>

                    {estados?.map((estado) => (
                        <div key={estado.id} className="flex flex-row justify-center items-center w-full">
                            <EstadoCard
                                estadoName={estado.nome}
                                quantity={estado.total}
                                dailyData={estado.quantitativo}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <ToastContainer />
        </>
    )
}