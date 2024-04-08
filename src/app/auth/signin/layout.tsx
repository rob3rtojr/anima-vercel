import {ReactNode} from "react"
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Pesquisa Educação - Autenticação'
};



interface PrivateLayoutProps {
    children: ReactNode
}

export default async function PrivateLayout({children}:PrivateLayoutProps) {

    return <>{children}</>

}