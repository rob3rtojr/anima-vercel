export type CardGenericProps<T = any> = {
    children: React.ReactNode,
    className?: string
} & T

export function Card({className, children}: CardGenericProps ) {
    return(
        <div className="flex flex-col justify-center items-center w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className={`flex flex-row w-full justify-between rounded-lg p-4 transition-all duration-700 bg-gray-200`}>
                {children}
            </div>
        </div>
    )
}

export function CardTitle({className, children}: CardGenericProps ) {
    return(
        <div className="flex text-blue-950 font-bold text-lg mb-4">
            {children}
        </div>
    )
}

export function CardBody({className, children}: CardGenericProps ) {
    return(
        <div className="flex flex-col text-lg text-blue-900 justify-start">
            {children}
        </div>
    )
}

export function CardFooter({className, children}: CardGenericProps ) {
    return(
        <div>
            {children}
        </div>
    )
}