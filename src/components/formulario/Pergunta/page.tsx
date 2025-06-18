import { cn } from "@/lib/utils"

type PropsType = {
    texto: string,
    textoAuxiliar?: string,
    isDisabled?: boolean,
    className?: any
}

export default function Pergunta(props: PropsType) {
    return (
        <div
            className={
                cn("flex flex-col font-bold text-lg lg:text-xl text-justify transition-all duration-700, text-blue-900",
                    props.className,
                    { 'text-gray-400': props.isDisabled }
                )}>
            <span>{props.texto}</span>
            <span className="italic text-lg font-normal">{props.textoAuxiliar}</span>
        </div>
    )
}