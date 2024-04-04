export default function Loading() {

    return (
        <>

            <header className="bg-slate-750 mt-20">
                <div className="flex flex-col justify-center gap-1 items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="font-alt text-4xl tracking-tight text-gray-200">Aguarde...</h1>
                    <p className='text-gray-400 text-sm'>Estamos carregando o formulário!</p>
                </div>
            </header>

            <div className="flex flex-col justify-center items-center w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className={`flex flex-row w-full justify-between rounded-lg p-4 bg-gray-300 animate-pulse`}>
                    <div className="p-4 w-full h-[300px] text-gray-400 text-2xl">
                        aguarde, carregando...
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className={`flex flex-row w-full justify-between rounded-lg p-4 bg-gray-300 animate-pulse`}>
                    <div className="p-4 w-full h-[300px] text-gray-400 text-2xl">
                        aguarde, carregando...
                    </div>
                </div>
            </div>
        </>

    )

}