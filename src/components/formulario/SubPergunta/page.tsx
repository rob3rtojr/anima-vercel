"use client";

import { cn } from "@/lib/utils"
import DOMPurify from "dompurify";

type PropsType = {
    texto: string,
    isDisabled?: boolean,
    className?: any
}

export default function SubPergunta(props: PropsType) {
    const safeHtml = DOMPurify.sanitize(props.texto);
    return (
        <div
            className={
                cn("text-lg italic text-justify transition-all duration-700, text-blue-900",
                    props.className,
                    { 'text-gray-400': props.isDisabled }
                )}>
            <span dangerouslySetInnerHTML={{ __html: safeHtml }} />
        </div>
    )
}