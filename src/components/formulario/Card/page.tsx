import { cn } from "@/lib/utils";
import React from "react";


type PropsType = {
    children: React.ReactNode,
    faltaResponder?: boolean,
    className?: any,
    id?: string
}

export function Card({children, faltaResponder, className, id}: PropsType) {
    return(
        <div id={id} className="flex flex-col justify-center items-center w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

            <div className={
                cn("flex flex-row w-full justify-between rounded-lg p-4 transition-all duration-700 bg-gray-200",
                className,
                {
                    "bg-red-100 border-4 border-red-800": faltaResponder,
                })}>
               
                <div className="flex flex-col p-4 w-full gap-4">
                    {children}
                </div>
                
            </div>
        </div>
    )
}

export function CardPergunta({children, faltaResponder, className}: PropsType) {
    return(
        <div className="flex flex-col justify-start w-full mx-auto max-w-7xl px-4 py-4 sm:px-6 md:py-6 lg:px-8">
            {children}
        </div>
    )
}

export function CardBody({children}: PropsType) {
    return(
        <div className="flex flex-col pl-8 w-full gap-2">
            {children}
        </div>
    )
}