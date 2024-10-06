import { cn } from "@/lib/utils"

type PropsType = {
    texto: string,
    isDisabled?: boolean,
    className?: any
}

export default function Pergunta(props: PropsType) {
    return (
        <div
            className={
                cn("font-bold text-xl text-justify transition-all duration-700, text-blue-900",
                    props.className,
                    { 'text-gray-400': props.isDisabled }
                )}>
            <span>{props.texto}</span>
        </div>
    )
}