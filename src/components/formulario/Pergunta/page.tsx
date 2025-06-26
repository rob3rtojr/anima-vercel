import { cn } from "@/lib/utils"
import DOMPurify from "dompurify";

type PropsType = {
    texto: string,
    textoAuxiliar?: string,
    isDisabled?: boolean,
    className?: any
}

export default function Pergunta(props: PropsType) {
    const safeHtml = DOMPurify.sanitize(props.texto);
    return (
        <div
            className={
                cn("flex flex-col font-bold text-lg lg:text-xl md:text-justify transition-all duration-700, text-blue-900",
                    props.className,
                    { 'text-gray-400': props.isDisabled }
                )}>
            <span dangerouslySetInnerHTML={{ __html: safeHtml }} />
            <span className="italic text-lg font-normal">{props.textoAuxiliar}</span>
        </div>
    )
}