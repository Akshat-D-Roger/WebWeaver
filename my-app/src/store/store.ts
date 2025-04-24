import { boltAction } from '@/types/boltAction'
import {create} from 'zustand'

export type userPromptsAndResponsesType = {
    type:'prompt'|'response',
    content:string|boltAction[]
}

interface storeType{
    prompts:string[],
    template:boltAction[],
    userPromptsAndResponses:userPromptsAndResponsesType[],
    setPrompts:(updated:string[])=>void,
    setTemplate:(updated:boltAction[])=>void,
    setUserPromptsAndResponses:(updated:userPromptsAndResponsesType[])=>void,
}

export const useStore = create<storeType>()((set)=>({
    prompts:[],
    template:[],
    userPromptsAndResponses:[],
    setPrompts:(updated)=>set({prompts:updated}),
    setTemplate:(updated)=>set({template:updated}),
    setUserPromptsAndResponses:(updated)=>set({userPromptsAndResponses:updated}),
}))