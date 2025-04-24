import {google} from '@ai-sdk/google'
import { generateText } from 'ai'

export const typeOfProject = async (userPrompt:string)=>{
    const res = await generateText({
        model:google('gemini-2.0-flash'),
        system:'You are an expert in telling whether a project is a react vite project or just a node.js project based on the user wanting of a project. You have to just reply in one word which is either "react" if project is a react vite project or "node" if project is a node.js backend project and nothing else.',
        prompt:userPrompt
    })
    return res.text.trim();
}