'use client'
import FileViewer from '@/components/FIleViewer';
import PromptsResponses from '@/components/PromptsResponses';
import WebContainerComponent from '@/components/WebContainer';
import { useInitialise } from '@/store/useInitialise';
import React, { useState } from 'react'

//make sure to turn off react strict mode in nextjs, else useEffect runs twice due to which my localStorage was getting removed
//on first run and on secons run it wasn't there

const Page = () => {
    const {template, userPromptsAndResponses, currActions, title, url, sendPrompts, generatingCode, generatingPreview} = useInitialise()
    const [previewSelected, setPreviewSelected] = useState(false);
    
  return (
    <div className='w-full h-full flex flex-col'>
        {title && <div className='sticky top-0 z-10 h-[3.5rem] flex items-center justify-center shrink-0 text-2xl font-semibold bg-black border-b border-neutral-500'>{title}</div>}
        <div className='w-full sm:h-[calc(100%-3.5rem)] sm:grow flex flex-col sm:flex-row p-[1rem] gap-[1rem]'>
            <div className='w-full sm:w-1/3 sm:h-full'>
                <PromptsResponses messages={userPromptsAndResponses} sendPrompts={sendPrompts} genCode={generatingCode} genPreview={generatingPreview}/>
            </div>
            {template && <div className='w-full sm:w-2/3 h-[90svh] sm:h-full flex flex-col border border-neutral-500 p-[0.5rem] rounded-md bg-zinc-800'>
                <div className='flex pb-[0.5rem] border-b border-neutral-500'>
                    <div className='flex flex-row gap-[1rem] rounded-full p-[0.5rem] bg-black'>
                        <div className={`rounded-full text-xs cursor-pointer ${!previewSelected && 'text-red-600'}`} onClick={()=>{setPreviewSelected(false)}}>Code</div>
                        <div className={`rounded-full text-xs cursor-pointer ${previewSelected && 'text-red-600'}`} onClick={()=>{setPreviewSelected(true)}}>Preview</div>
                    </div>
                </div>
                <div className='w-full grow overflow-auto pt-[0.5rem] pb-[0.5rem]'>
                    {previewSelected ? <WebContainerComponent url={url}/>: <FileViewer files={currActions}/>}
                </div>
            </div>}
        </div>
    </div>
  )
}

export default Page