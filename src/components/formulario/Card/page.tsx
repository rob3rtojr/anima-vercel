import { cn } from "@/lib/utils";
import React from "react";


type PropsType = {
    children: React.ReactNode,
    faltaResponder?: boolean,
    className?: any,
    id?: string,
    hide?: boolean
}

export function Card({children, faltaResponder, className, id, hide}: PropsType) {
    return(
        // <div id={id} className={`flex flex-col justify-center items-center w-full mx-auto max-w-7xl px-1 md:px-4 py-6 sm:px-6 lg:px-8 ${hide ? 'invisible h-0':'visible'}`}>
        <div
        id={id}
        className={`
            flex flex-col justify-center items-center w-full mx-auto max-w-7xl 
            px-1 md:px-4 py-6 sm:px-6 lg:px-8
            text-xs sm:text-sm md:text-base
            transition-all duration-700 ease-in-out 
            ${hide ? 'opacity-0 pointer-events-none max-h-0 pb-0' : 'opacity-100 pointer-events-auto max-h-screen'}
        `}
        >

            <div className={
                cn("flex flex-row w-full justify-between rounded-lg p-1 md:p-4 transition-all duration-700 bg-gray-200",
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

export function CardPergunta({children, faltaResponder, className, hide}: PropsType) {
    return(
        // <div className={cn("flex flex-col justify-start w-full mx-auto max-w-7xl px-4 py-4 sm:px-6 md:py-6 lg:px-8", className)}>
        //     <div className={
        //         cn("flex flex-row w-full justify-between rounded-lg p-1 md:p-4 transition-all duration-700 bg-violet-500")}>
        //         <div className="flex flex-col p-4 w-full gap-4">
        //             {children}
        //         </div>
        //     </div>            
        // </div>

        <div
        className={`
            flex flex-col justify-center items-center w-full mx-auto max-w-7xl 
            px-1 md:px-4 py-6 sm:px-6 lg:px-8 
            transition-all duration-700 ease-in-out 
            ${hide ? 'opacity-0 pointer-events-none max-h-0 pb-0' : 'opacity-100 pointer-events-auto max-h-screen'}            
        `}
        >

            <div className={
                cn("flex flex-row w-full justify-between rounded-lg p-1 md:p-4 transition-all duration-700 bg-violet-500")}>
                <div className="flex flex-col p-4 w-full gap-4">
                    {children}
                </div>
            </div>
        </div>        
    )
}

export function CardBody({children}: PropsType) {
    return(
        <div className="flex flex-col pl-0 md:pl-8 w-full gap-2">
            {children}
        </div>
    )
}