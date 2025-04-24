'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'

const FormSubmit = ({text}:{text:string}) => {
  const {pending} = useFormStatus();
  return (
    <>
      <button disabled={pending} type='submit' className={`w-full py-[1rem] bg-black text-white hover:text-red-600 text-center border rounded-md cursor-pointer transition-all ${pending && 'opacity-40'}`}>{pending ? 'thinking...' : text}</button> 
    </>
  )
}

export default FormSubmit