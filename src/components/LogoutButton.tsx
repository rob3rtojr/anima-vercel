'use client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react';


export default function LogoutButton () {
    const router = useRouter()

    async function logout() {
        await signOut({
            redirect: false
        })

        router.replace('/')
    }

    return <button onClick={logout} className="flex items-center gap-2 transition-colors ml-2 p-2 mr-2 text-violet-400  rounded hover:bg-violet-700 hover:text-white">Sair <LogOut/></button>


}