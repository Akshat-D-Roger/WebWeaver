'use server'
import { userPromptSchema } from "./schema/promptSchema";
import axios, { AxiosError } from 'axios';
import { apiResponse } from "./types/apiResponse";
import { messagePromptsType } from "./types/messagePromptsType";

export async function getTemplate(formData:FormData):Promise<apiResponse>{
    const userPrompt:string = (formData.get('prompt') as string).trim();
    const validationResult = userPromptSchema.safeParse(userPrompt);
    if(!validationResult.success){
        return {success:false, message:validationResult.error.issues[0].message}
    }
    try {
        const res = await axios.post(`${process.env.NEXTAPP_WEB_URL}/api/template`, {userPrompt});
        const {prompts, files} = res.data;
        return {success:true, message:res.data.message, prompts, files}
    } catch (error) {
        if(error instanceof AxiosError){
            return {success:false, message:error.response?.data.message}
        }
        else{
            console.log(error)
            return {success:false, message:'unknow error occured'}
        }
    }
}

export async function sendPrompt(messagePrompts:messagePromptsType[]):Promise<apiResponse>{
    try {
        const res = await axios.post(`${process.env.NEXTAPP_WEB_URL}/api/chat`, {messagePrompts})
        return {success:true, message:res.data.text}
    } catch (error) {
        if(error instanceof AxiosError){
            return {success:false, message:error.response?.data.message}
        }
        else{
            console.log(error)
            return {success:false, message:'unknown error'}
        }
    }
}