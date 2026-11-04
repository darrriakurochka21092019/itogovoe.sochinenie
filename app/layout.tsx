import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Мастерская сочинения',description:'Личный кабинет подготовки к итоговому сочинению для 11 класса',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
