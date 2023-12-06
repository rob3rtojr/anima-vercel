import { getServerSession } from "next-auth"
import {ReactNode} from "react"
import { nextAuthOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Pesquisa Educação - Estados'
};

interface PrivateLayoutProps {
    children: ReactNode
}

export default async function PrivateLayout({children}:PrivateLayoutProps) {
    const session = await getServerSession(nextAuthOptions)

    if (session) {
        redirect('/user/listaFormularios')
    }

    return <>{children}</>

}