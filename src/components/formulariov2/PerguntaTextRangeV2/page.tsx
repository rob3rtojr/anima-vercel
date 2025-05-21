
import { PerguntaType } from "@/Types/types"
import Pergunta from "@/components/formulario/Pergunta/page";
import { useEffect, useState } from "react";

type PropsType = {
    props: PerguntaType,
    isDisabled: boolean,
    inputValue: string | undefined,
    handleInputText: (idPergunta: string, value: string, mascaraResposta: string | undefined) => void,
    handleAtualizaResposta: (idPergunta: string, idAlternativa: string, valor: string, idTipoPergunta: number) => void,
    min: number | undefined,
    max: number | undefined,
    step: number | undefined,
    mascara: string | undefined,
    isSaving: boolean
}

export default function PerguntaRangeV2(props: PropsType) {
    const [width, setWidth] = useState("");
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    useEffect(() => {

        props.inputValue !== undefined ? setWidth(props.inputValue) : setWidth("0")
        setMin(props.min ? props.min : 0)
        setMax(props.max ? props.max : 0)

    }, [props.inputValue])

    const changeWidth = (event: React.ChangeEvent<HTMLInputElement>, idPergunta: string, mascaraResposta: string | undefined) => {
        setWidth(event.target.value);
        props.handleInputText(idPergunta, event.target.value,mascaraResposta)
    };

    const onClickRange = (idPergunta: string, idAlternativa: string, valor: string, idTipoPergunta: number) => {
        let valorAux: string;

        if (valor.toString() ==="0") {
            setWidth(min.toString())
            valorAux = min.toString()
        } else {
            valorAux = valor
        }

        props.handleAtualizaResposta(idPergunta,"", valorAux, idTipoPergunta)
    }

    return (
        <>

            <div className="flex flex-row justify-between items-center">
                <p className="text-gray-500">{props.mascara === "moeda" ? min.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : props.min}</p>
                <p className="text-gray-500">{props.mascara === "moeda" ? max.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : props.max}</p>
            </div>


            <input
                type="range"
                min={props.min}
                max={props.max}
                step={props.step}
                onChange={(e) => changeWidth(e,props.props.id,props.props.mascaraResposta)}

                onMouseUp={(e) => onClickRange(props.props.id,"", width.toString(), props.props.tipoPerguntaId)}
                onTouchEnd={(e) => onClickRange(props.props.id,"", width.toString(), props.props.tipoPerguntaId)}
                value={props.isDisabled ? 0: width}
                className="w-full h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                disabled={props.isDisabled}

            />

            <div className="">
                {props.mascara === "moeda" && <Pergunta key={`pr${props.props.id}`} texto={`Resposta: ${parseInt(width).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`} />}
                {props.mascara === "" && <Pergunta key={`pr${props.props.id}`} texto={`Resposta: ${props.isDisabled ? 0: width}`} />}
            </div>

            
        </>
    )
}
