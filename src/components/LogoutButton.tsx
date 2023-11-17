'use client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogoutButton () {
    const router = useRouter()

    async function logout() {
        await signOut({
            redirect: false
        })

        router.replace('/')
    }

    return <button onClick={logout} className="transition-colors ml-2 p-2 mr-2 border border-violet-700 text-violet-400 hover:text-violet-400 rounded hover:bg-slate-800">SAIR</button>


}