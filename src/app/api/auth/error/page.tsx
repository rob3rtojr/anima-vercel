'use client'
import Button from '@/components/elements/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ErroPage() {

    const router = useRouter()  
    const [isLoading, setIsLoading] = useState(false)
    function voltar() {

        setIsLoading(true)
        router.back()
    }

    return (
    
        <div className={"flex flex-col justify-center items-center h-screen bg-slate-800 gap-1"}>
            <p className="text-white text-lg">Ocorreu um erro!</p>
          
            <Button className='mt-4' onClick={voltar} isLoading={isLoading}>Tentar Novamente</Button>

        </div>
    
        )
}