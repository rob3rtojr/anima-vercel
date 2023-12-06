
import { PerguntaType } from "@/Types/types"
import Pergunta from "../Pergunta/page"
import { useEffect, useState } from "react";

type PropsType = {
    props: PerguntaType,
    isDisabled: boolean,
    inputValue: string | undefined,
    handleInputTextBlur: (idPergunta: string, value: string) => void,
    min: number | undefined,
    max: number | undefined,
    step: number | undefined,
    mascara: string | undefined,
    isSaving: boolean
}

export default function PerguntaRange(props: PropsType) {
    const [width, setWidth] = useState("");
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    useEffect(() => {

        props.inputValue !== undefined ? setWidth(props.inputValue) : setWidth("0")
        setMin(props.min ? props.min : 0)
        setMax(props.max ? props.max : 0)

    }, [props.inputValue])

    const changeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWidth(event.target.value);
    };

    return (
        <>
            <div key={`descricaopergunta5${props.props.id}`}>
                <div><Pergunta key={`p${props.props.id}`} texto={`${props.props.numero} - ${props.props.descricao}`} /></div>
            </div>

            
                <div className="flex flex-row justify-between items-center">
                    <p className="text-gray-500">{props.mascara === "moeda" ? min.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : props.min}</p>
                    <p className="text-gray-500">{props.mascara === "moeda" ? max.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : props.max}</p>
                </div>
            

            <input
                type="range"
                min={props.min}
                max={props.max}
                step={props.step}
                onChange={changeWidth}
                onMouseUp={(e) => props.handleInputTextBlur(props.props.id, width.toString())}
                value={width}
                className="w-full h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                disabled={props.isSaving}

            />

            <div className="">
                {props.mascara === "moeda" && <Pergunta key={`pr${props.props.id}`} texto={`Resposta: ${parseInt(width).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`} />}
                {props.mascara === "" && <Pergunta key={`pr${props.props.id}`} texto={`Resposta: ${width}`} />}
            </div>
            {/* <input
            key={`input2${props.props.id}`}
            onChange={(e) => props.handleInputText(props.props.id, e.target.value)}
            onBlur={(e) => props.handleInputTextBlur(props.props.id, e.target.value)}
            placeholder="Digite aqui sua resposta"
            className="border-2 rounded-md border-blue-200 bg-white p-2" 
            type="text"
            value={props.inputValue}
        /> */}
        </>
    )
}
