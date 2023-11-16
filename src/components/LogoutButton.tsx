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

    return <button onClick={logout} className="text-violet-400 hover:text-violet-700 text-sm justify-end">[ SAIR ]</button>


}