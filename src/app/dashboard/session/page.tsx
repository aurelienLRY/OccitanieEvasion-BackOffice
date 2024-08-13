'use client'
import React, { useState } from 'react'
import SessionForm from '@/components/form/sessionForm'

type Props = {}

const SessionPage = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  
  
  return (
    <div>
      SessionPage
      <button onClick={() => setIsOpen(true)} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Créer une session</button>

      <SessionForm isOpen={isOpen} onClose={() => setIsOpen(false)} />

     
     
    
    </div>
  )
}

export default SessionPage;
