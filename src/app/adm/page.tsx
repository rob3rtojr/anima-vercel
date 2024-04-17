'use client'
import Button from "@/components/elements/Button"
import Combo from "@/components/elements/Combo"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink, CSVDownload } from "react-csv"
import LoadTable from "./components/LoadTable"
import TableAnima from "./components/TableAnima"

type Resultado = {
    1: number,
    _1_abs: number,
    2: number,
    _2_abs: number,
    3: number,
    _3_abs: number,
    4: number,
    _4_abs: number,    
    codigoMec: string
    regional: string,
    municipio: string,
    nome: string
}

type Formulario = {
    id: number,
    descricao: string,
    tipo: string
}

type Column = {
    label: string,
    accessor: string,
    sortable: boolean,
    align: string,
    size: string
}

export default function Adm() {
    //    const [estados, setEstados] = useState<Estado[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formularios, setFormularios] = useState<Formulario[]>();
    const [formularioId, setFormularioId] = useState<string>("0");
    const [filtroInicialEstado, setFiltroInicialEstado] = useState<string>("");
    const [estadoId, setEstadoId] = useState<string>("0");
    const [regionalId, setRegionalId] = useState<string>("0");
    const [municipioId, setMunicipioId] = useState<string>("0");
    const [escolaId, setEscolaId] = useState<string>("0");
    const [turmaId, setTurmaId] = useState<string>("0");
    const [tipo, setTipo] = useState<string>("");
    const [agrupador, setAgrupador] = useState<string>("");

    const [resultado, setResultado] = useState<Resultado[]>();
    const [hideCampos, setHideCampos] = useState<boolean>(false)
    const [meta, setMeta] = useState<number>(0)

    const [columns, setColumns] = useState<Column[]>()

    useEffect(() => {

        const fetchOptions = async () => {

            const response = await api.get(`/tipoFormularios`)
            setFormularios(response.data)

        }
        fetchOptions()

        setFiltroInicialEstado("todos")


    }, [])

    const handleAgruparEscola = () => {
        
        agrupador === '' ? setAgrupador('escola') : setAgrupador('')
    }

    const handleSelectFormulario = (selectedOption: string) => {
        setFormularioId(selectedOption)
        setHideCampos(false)

        const index = formularios?.findIndex((f) => f.id.toString() === selectedOption)
        if (formularios && index) {
            if (formularios[index]) {
                if (formularios[index].tipo === "professor") {
                    setHideCampos(true)
                    setEscolaId("0")
                    setTurmaId("0")
                    setTipo(formularios[index].tipo)
                }
            }
        }
    }

    const handleSelectEstado = (selectedOption: string) => {
        setEstadoId(selectedOption)
        setRegionalId("0")
        setMunicipioId("0")
        setEscolaId("0")
        setTurmaId("0")
        setAgrupador('')
    }

    const handleSelectReginal = (selectedOption: string) => {
        setRegionalId(selectedOption)
        setMunicipioId("0")
        setEscolaId("0")
        setTurmaId("0")
        setAgrupador('')
    }

    const handleSelectMunicipio = (selectedOption: string) => {
        setMunicipioId(selectedOption)
        setEscolaId("0")
        setTurmaId("0")
    }

    const handleSelectEscola = (selectedOption: string) => {
        setEscolaId(selectedOption)
        setTurmaId("0")
        setAgrupador('')
    }

    const handleSelectTurma = (selectedOption: string) => {
        setTurmaId(selectedOption)
    }

    const handleClear = () => {
        setResultado([])

        setRegionalId("0")
        setMunicipioId("0")
        setEscolaId("0")
        setTurmaId("0")
        setAgrupador('')

    }

    const formataNumero = (valor: number) => {
        return valor === null ? 0 : valor
    }


    const handleSubmit = () => {
        setResultado([])
        const fetchOptions = async () => {

            let rota: string = `/quantitativo/${formularioId}?`

            if (turmaId !== "0") {
                rota += `turmaId=${turmaId}`
            } else if (escolaId !== "0") {
                rota += `escolaId=${escolaId}`

                // } else if (municipioId !== "0") {
                //     rota += `municipioId=${municipioId}`

            } else if (regionalId !== "0") {
                rota += `regionalId=${regionalId}`

            } else {
                rota += `estadoId=${estadoId}`
                agrupador!=='' ? rota+=`&agrupador=${agrupador}` : rota+=''
            }

            await api.get(rota)
                .then((response) => {

                    let _resultado: any[] = []

                    response.data.map((r: any) => {
                        let total = r[1] + r[2] + r[3] + r[4]
                        let d
                        if (agrupador === 'escola' || (regionalId !== "0" && escolaId === "0")) {
                            
                            d = {
                                "inep": r.codigoMec,
                                "nome": r.nome,
                                "municipio": r.municipio,
                                "regional": r.regional,
                                "nao_iniciado": ((formataNumero(r[1]) * 100) / formataNumero(total)).toFixed(2),
                                "_nao_iniciado_abs": formataNumero(r[1]),
                                "recusado": ((formataNumero(r[4]) * 100) / formataNumero(total)).toFixed(2),
                                "_recusado_abs": formataNumero(r[4]),
                                "iniciado": ((formataNumero(r[2]) * 100) / formataNumero(total)).toFixed(2),
                                "_iniciado_abs": formataNumero(r[2]),
                                "finalizado": ((formataNumero(r[3]) * 100) / formataNumero(total)).toFixed(2),
                                "_finalizado_abs": formataNumero(r[3]),
                                "total": total
                            }
                        } else {

                            d = {
                                "nome": r.nome,
                                "nao_iniciado": ((formataNumero(r[1]) * 100) / formataNumero(total)).toFixed(2),
                                "_nao_iniciado_abs": formataNumero(r[1]),
                                "recusado": (( formataNumero(r[4]) * 100) / formataNumero(total)).toFixed(2),
                                "_recusado_abs": formataNumero(r[4]),
                                "iniciado": ((formataNumero(r[2]) * 100) / formataNumero(total)).toFixed(2),
                                "_iniciado_abs": formataNumero(r[2]),
                                "finalizado": ((formataNumero(r[3]) * 100) / formataNumero(total)).toFixed(2),
                                "_finalizado_abs": formataNumero(r[3]),
                                "total": total
                            }
                        }

                        _resultado.push(d)

                        //definição da meta por estado  formulário
                        // 4	Projeto de Vida	aluno
                        // 5	Projeto de Vida	professor
                        // 6	Educação Financeira	aluno
                        // 7	Educação Financeira	professor                      
                        switch (estadoId) {
                            case "1":
                                if (formularioId === "1") {
                                    setMeta(90)
                                }
                                break;
                            // case "3":

                            //     if (formularioId === "4") {
                            //         setMeta(70)
                            //     } else if (formularioId === "5") {
                            //         setMeta(80)
                            //     }
                            //     break;

                            // case "2":
                            //     if (formularioId === "4") {
                            //         setMeta(20)
                            //     } else if (formularioId === "5") {
                            //         setMeta(30)
                            //     } else if (formularioId === "6") {
                            //         setMeta(75)
                            //     } else if (formularioId === "7") {
                            //         setMeta(85)
                            //     }
                            //     break
                            default:
                                break;
                        }


                    })

                    setResultado(_resultado)
                    setIsLoading(false)
                    
                })

            setIsLoading(false)
        }



        if (formularioId === "0" || formularioId === "todos") {

            toast.warn("Escolha um formulário")
            return
        }

        setIsLoading(true)
        fetchOptions()


        if (agrupador === 'escola' || (regionalId !== "0" && escolaId === "0")) {

            setColumns([


                { label: "INEP", accessor: "inep", sortable: true, align: 'left', size: "5" },
                { label: "NOME", accessor: "nome", sortable: true, align: 'left', size: "20" },
                { label: "MUNICIPIO", accessor: "municipio", sortable: true, align: 'left', size: "15" },
                { label: "REGIONAL", accessor: "regional", sortable: true, align: 'left', size: "10" },

                { label: "NÃO INICIADO", accessor: "nao_iniciado", sortable: true, align: 'rigth', size: "10" },
                { label: "RECUSADO", accessor: "recusado", sortable: true, align: 'rigth', size: "10" },
                { label: "INICIADO MAS NÃO FINALIZADO", accessor: "iniciado", sortable: true, align: 'rigth', size: "10" },
                { label: "FINALIZADO", accessor: "finalizado", sortable: true, align: 'rigth', size: "10" },
                { label: "TOTAL", accessor: "total", sortable: true, align: 'rigth', size: "10" },
            ])


        } else {

            setColumns([
                { label: "NOME", accessor: "nome", sortable: true, align: 'left', size: "50" },
                { label: "NÃO INICIADO", accessor: "nao_iniciado", sortable: true, align: 'rigth', size: "10" },
                { label: "RECUSADO", accessor: "recusado", sortable: true, align: 'rigth', size: "10" },
                { label: "INICIADO MAS NÃO FINALIZADO", accessor: "iniciado", sortable: true, align: 'rigth', size: "10" },
                { label: "FINALIZADO", accessor: "finalizado", sortable: true, align: 'rigth', size: "10" },
                { label: "TOTAL", accessor: "total", sortable: true, align: 'rigth', size: "10" },
            ])


        }
    }

    return (
        <>
            <div className={"flex md:flex-col flex-col justify-start w-full h-screen bg-slate-800 gap-1"}>
                <div className="bg-slate-900 text-white h-10 w-full text-center text-2xl">Acompanhamento</div>
                <div className="ml-8 mr-8 mb-8">
                    <div className="flex flex-row justify-between w-full gap-2 pt-4">
                        <div className="w-full"><Combo labelText='Formulario' idRota="tipoFormularios" idFiltro={filtroInicialEstado} onSelect={handleSelectFormulario} idSelecionado={formularioId} /></div>
                        <div className="w-full"><Combo labelText='Estado' idRota="estados" idFiltro={filtroInicialEstado} onSelect={handleSelectEstado} idSelecionado={estadoId} /></div>
                        <div className="w-full"><Combo labelText='Regional' idRota="regionais" idFiltro={estadoId} onSelect={handleSelectReginal} idSelecionado={regionalId} /></div>
                    </div>
                    <div className="flex flex-row justify-between w-full gap-2">

                        {!hideCampos &&
                            <>
                                <div className="w-full"><Combo labelText='Escola' idRota="escolas-por-regional" idFiltro={regionalId} onSelect={handleSelectEscola} idSelecionado={escolaId} /></div>
                            </>
                        }
                        
                    </div>
                    {estadoId !== '0' && regionalId==='0' &&
                    <div className="flex flex-row items-center pt-8 gap-2 text-gray-400">
                        <input 
                            type="checkbox" 
                            name="chkAgruparPorEscola" 
                            id="chkAgruparPorEscola" 
                            onClick={()=>handleAgruparEscola()} 
                            checked={agrupador==='escola'?true:false}
                            /> Uso interno. (<i>Regionais: ignorar essa opção</i>)
                    </div>
                    }
                    <div className="flex flex-row items-center pt-8 gap-2">
                        <Button isLoading={isLoading} onClick={handleSubmit} >Filtrar</Button>
                        <Button isLoading={false} onClick={handleClear} >Limpar</Button>
                    </div>

                    {resultado && resultado?.length > 0 &&
                        <>
                            <div className="w-full text-right text-white font-bold p-4 cursor-pointer">
                                <CSVLink data={resultado} target="_blank" filename="result.csv" separator=";">Baixar csv</CSVLink>
                            </div>

                            <TableAnima columns={columns} data={resultado} meta={meta} />
                        </>
                    }

                    {isLoading &&
                        <>
                            <div className="mt-10">...</div>
                            <LoadTable />
                        </>
                    }


                </div>

            </div >
            <ToastContainer />
        </>
    )

}