import React from 'react'
import ThemeToggle from '@/components/ThemeToggle'

type Props = {}

const Header = (props: Props) => {
  return (
    <header className="flex justify-between items-center p-4 px-10" >
        <h1 className="text-2xl font-bold">Occitanie<span className='text-sky-500 text-4xl'>.</span>Evasion</h1>
        <ThemeToggle />
    </header>
  )
}

export default Header