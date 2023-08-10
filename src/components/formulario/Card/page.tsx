import React from "react";


type PropsType = {
    children: React.ReactNode,
    faltaResponder: boolean
}

export default function Card({children, faltaResponder}: PropsType) {
    return(
        <div className="flex flex-col justify-center items-center w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ">
            <div className={`flex flex-row w-full justify-between rounded-lg p-4 transition-all duration-700 ${faltaResponder ? `bg-red-100 border-4 border-red-800`: `bg-gray-200`}`}>
               
                <div className="p-4 w-full">
                    {children}
                </div>
                
            </div>
        </div>
    )
}