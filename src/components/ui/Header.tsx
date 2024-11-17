/* LIBRAIRIES */
import React from 'react'

/* Components */
import ThemeToggle from '@/components/ui/ThemeToggle'



/**
 * Header Component
 * @returns {JSX.Element} Le composant barre de navigation.
 */
export const Header = () => {

  //TODO:  +add logo
  return (
    <header className="flex justify-between items-center p-4  lg:px-10 " >
        <h1 className="text-2xl font-bold">Occitanie<span className='text-sky-500 text-4xl'>.</span>Evasion</h1>      
        <ThemeToggle />
    </header>
  )
}