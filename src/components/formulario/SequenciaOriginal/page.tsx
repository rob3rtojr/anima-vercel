import { cn } from "@/lib/utils"

type PropsType = {
    numeroOriginal: string
}

export default function SequenciaOriginal(props: PropsType) {
    return (
        <>
            <span className="flex flex-row justify-start text-sm font-thin text-gray-400 ">ref: {props.numeroOriginal}</span>
        </>
    )
}