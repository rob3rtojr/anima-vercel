import * as React from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import Button from "@/components/elements/Button"

type MunicipioEscolaProps = {
    estadoId: number;
    handleSelectTurma: (turma: string) => void;
    handleSelectEscola: (escola: string) => void;
    handleSelectedMunicipio: (mnicipio: string) => void;
    setPossuiTurma: (possuiTurma: boolean) => void;
    handleStart: () => void;
    nomeFormulario: string;
}

type MunicipioSA = {
    id: number,
    nome: string,
    estadoId: number
}

type EscolaSA = {
    id: number,
    inep: number,
    nome: string,
    municipioSaId: number
}

type TurmaSA = {
    id: number,
    nome: string,
    escolaSaId: number
}


export function MunicipioEscola(props: MunicipioEscolaProps) {

    const baseUrl: any = process.env.NEXT_PUBLIC_BASE_URL

    const [listaMunicipios, setListaMunicipios] = useState<MunicipioSA[]>([])
    const [listaEscolas, setListaEscolas] = useState<EscolaSA[]>([])
    const [listaTurmas, setListaTurmas] = useState<TurmaSA[]>([])
    const [loadingMunicipio, setLoadingMunicipio] = useState<boolean>(true)
    const [loadingEscola, setLoadingEscola] = useState<boolean>(false)
    const [loadingTurma, setLoadingTurma] = useState<boolean>(false)
    const [totalTurmaEstado, setTotalTurmaEstado] = useState<number>(0)
    const [selectedMunicipio, setSelectedMunicipio] = useState<string>('0')
    const [selectedEscola, setSelectedEscola] = useState<string>('0')
    const [selectedTurma, setSelectedTurma] = useState<string>('0')

    useEffect(() => {

        const fetchOptions = async () => {

            try {
                setLoadingMunicipio(true)
                const result = await api.get(`${baseUrl}/municipiossa/${props.estadoId}`)
                const municipios: MunicipioSA[] = result.data

                const resultTotal = await api.get(`${baseUrl}/total-turmassa/${props.estadoId}`)
                setTotalTurmaEstado(resultTotal.data)
                if (resultTotal.data > 0) {
                    props.setPossuiTurma(true)
                }
                setListaMunicipios(municipios)
                setLoadingMunicipio(false)
            }
            catch (err: any) {
                return
            }
        }

        fetchOptions()


    }, [baseUrl, props.estadoId])


    async function handleSelectMunicipio(municipioId: string) {
        setLoadingEscola(true)
        
        console.log((`${baseUrl}/escolassa/${municipioId}${totalTurmaEstado>0 ? '?possuiTurma=S' : ''}`))
        const result = await api.get(`${baseUrl}/escolassa/${municipioId}${totalTurmaEstado>0 ? '?possuiTurma=S' : ''}`)
        const escolas: EscolaSA[] = result.data
        setListaEscolas(escolas)
        setLoadingEscola(false)
        props.handleSelectedMunicipio(municipioId)
        setSelectedMunicipio(municipioId)
        setSelectedEscola('0')
        setSelectedTurma('0')
    }

    async function handleSelectEscola(escolaId: string) {
        setLoadingTurma(true)
        const result = await api.get(`${baseUrl}/turmassa/${escolaId}`)
        const turmas: TurmaSA[] = result.data
        setListaTurmas(turmas)
        setLoadingTurma(false)
        props.handleSelectEscola(escolaId)
        setSelectedEscola(escolaId)
        setSelectedTurma('0')
    }

    async function handleSelectTurma(turmaId: string) {
        setSelectedTurma(turmaId)
        props.handleSelectTurma(turmaId)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{`${loadingMunicipio ? 'Aguarde...' : 'Questionário: ' + props.nomeFormulario}`}</CardTitle>
                <CardDescription>Escolha seu município e sua escola </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="municipio">Município</Label>
                            <select value={selectedMunicipio} id="municipio" onChange={(municipio) => { handleSelectMunicipio(municipio.target.value) }} className='border border-slate-400 disabled:border-slate-100 w-full block outline-none py-1 px-1 transition-all text-xs lg:text-sm xl:text-base mb-1 md:mb-4 bg-slate-50 focus:shadow focus:shadow-blue-500 rounded-md'>
                                <option value="0">{`${loadingMunicipio ? 'Carregando municipios...' : 'Informe o município'}`}</option>
                                {listaMunicipios.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="escola">Escola</Label>
                            <select value={selectedEscola} id="escola" onChange={(escola) => { handleSelectEscola(escola.target.value) }} className='border border-slate-400 disabled:border-slate-100 w-full block outline-none py-1 px-1 transition-all text-xs lg:text-sm xl:text-base mb-1 md:mb-4 bg-slate-50 focus:shadow focus:shadow-blue-500 rounded-md'>
                                <option value="0">{`${loadingEscola ? 'Carregando escolas...' : 'Informe a escola'}`}</option>
                                {listaEscolas.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.nome}
                                    </option>
                                ))}
                            </select>
                            
                        </div>
                        {totalTurmaEstado > 0 &&
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="turma">Turma</Label>
                                <select value={selectedTurma} id="turma" onChange={(turma) => { handleSelectTurma(turma.target.value) }} className='border border-slate-400 disabled:border-slate-100 w-full block outline-none py-1 px-1 transition-all text-xs lg:text-sm xl:text-base mb-1 md:mb-4 bg-slate-50 focus:shadow focus:shadow-blue-500 rounded-md'>
                                    <option value="0">{`${loadingTurma ? 'Carregando turmas...' : 'Informe a turma'}`}</option>
                                    {listaTurmas.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }           
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button className="w-full" onClick={() => props.handleStart()}>Acessar</Button>
            </CardFooter>
        </Card>
    )
}
