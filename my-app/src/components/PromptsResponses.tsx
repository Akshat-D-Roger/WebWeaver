import { userPromptSchema } from '@/schema/promptSchema';
import { userPromptsAndResponsesType } from '@/store/store'
import { boltAction } from '@/types/boltAction'
import React from 'react'
import { toast } from 'sonner';
import FormSubmit from './FormSubmit';
import Loader from './Loader';

const PromptsResponses = ({messages, sendPrompts, genCode, genPreview}:{messages:userPromptsAndResponsesType[], sendPrompts: (prompts: string[]) => Promise<void>, genCode:boolean, genPreview:boolean}) => {


async function onSubmitHandler(formData:FormData){
    const userPrompt:string = (formData.get('prompt') as string).trim();
    const validationResult = userPromptSchema.safeParse(userPrompt);
    if(!validationResult.success){
        toast(validationResult.error?.issues[0]?.message)
        return
    }
    sendPrompts([userPrompt])
}

  return (
    <>
        <div className='w-full h-full flex flex-col p-[1rem]'>
            <div className='h-3/4 w-full px-[1rem]'>
                <div className='w-full h-full overflow-auto flex flex-col gap-[1rem]'>
                    {messages.map((message, index)=>{
                        if(message.type === 'prompt'){
                            const content = message.content as string
                            return(
                                <div key={index} className='bg-neutral-600 rounded-md p-[1rem]'>{content}</div>
                            )
                        }
                        else{
                            const actions = message.content as boltAction[]
                            return(
                                <div key={index} className='flex flex-col gap-2 bg-neutral-800 rounded-md p-[1rem]'>
                                    {actions.map((item, index)=>{
                                        return(
                                            <div key={index}>{item.type==='shell' ? `Run ${item.content}` : item.type==='file' ? `Create ${item.filePath}` : <></>}</div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    })}

                    {genCode && 
                        <div className='p-[1rem] rounded-md bg-white'>
                            <Loader/>
                            <div className='text-neutral-500 text-center text-sm font-semibold'>generating code</div>
                        </div>
                    }
                    {genPreview && 
                        <div className='p-[1rem] rounded-md bg-white text-center'>
                            <Loader/>
                            <div className='text-neutral-500 text-center text-sm font-semibold'>generating preview (works only with laptop/desktop)</div>
                        </div>
                    }

                </div>
            </div>
            <form action={onSubmitHandler} className='h-1/4 w-full flex flex-col'>
                <textarea name="prompt" id="prompt" className='grow w-full p-[1rem] border border-neutral-500 rounded-md bg-gradient-to-br from-gray-800 via-black to-gray-900' placeholder='do you want to change anything ?'></textarea>
                <div className='xh-[20%]'><FormSubmit text="Send"/></div>
            </form>
        </div>
    </>
  )
}

export default PromptsResponses