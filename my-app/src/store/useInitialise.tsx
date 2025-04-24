import { useEffect, useState } from "react";
import { userPromptsAndResponsesType, useStore } from "./store";
import { boltAction } from "@/types/boltAction";
import { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { useRouter } from "next/navigation";
import { sendPrompt } from "@/actions";
import { parseBoltArtifact } from "@/helper/parseBoltArtifact";
import { toast } from "sonner";
import { getFilesAndCommandsForWebContainer } from "@/helper/getFilesAndCommandsForWebContaner";
import { installDependency } from "@/helper/installDependency";
import { messagePromptsType } from "@/types/messagePromptsType";

export function useInitialise(){
    const {template, prompts, userPromptsAndResponses, setUserPromptsAndResponses} = useStore();
    const [currActions, setCurrActions] = useState<boltAction[]>([])
    const [title, setTitle] = useState<string>();
    const [container, setContainer] = useState< WebContainer | null>(null);
    const [devProcess, setDevProcess] = useState<WebContainerProcess|null>(null)
    const [url, setUrl] = useState('')
    const [messagePrompt, setMessagePrompt] = useState<messagePromptsType[]>([])
    const [generatingCode, setGeneratingCode] = useState(false)
    const [generatingPreview,  setGeneratingPreview] = useState(false)
    const router = useRouter()

    async function sendPrompts(prompts:string[]){
        setGeneratingCode(true)
        let newConversation = [...messagePrompt, ...(prompts.map(item=>({role:'user', content:item} as messagePromptsType)))]
        const res = await sendPrompt(newConversation);
        if(!res.success){
            toast.error(res.message)
            router.push('/')
        }
        else{
            const content = res.message
            newConversation = [...newConversation, {role:'assistant', content} as messagePromptsType]
            setMessagePrompt(newConversation)
            const {title, actions} = parseBoltArtifact(content)
            if(title)
            setTitle(title)
            if(actions.length > 0){
                console.log(actions);
                setCurrActions(actions)
                const updated = [...userPromptsAndResponses, {type:'response', content:actions} as userPromptsAndResponsesType]
                setUserPromptsAndResponses(updated)
            }
        }
        setGeneratingCode(false)
    }

    async function initialiseContainer(){
        const webcontainerInstance = await WebContainer.boot()
        console.log('booting web container')
        setContainer(webcontainerInstance)
        return webcontainerInstance
    }

    async function clearFiles(){
        if(!container)
            return
        const files = await container.fs.readdir('/');
        for(const file of files){
            await container.fs.rm(`/${file}`, {recursive:true, force:true})
        }
    }
    async function runCommands(commands:string[]){
        console.log(`running commands:${commands}`)
        if (!container || commands.length<1) 
        return null;
        setGeneratingPreview(true)
        console.log("Registering server-ready event listener");
        container.on('server-ready', (port, url) => {
            console.log(`Server ready on port: ${port}, url: ${url}`);
            setUrl(url);
        });
        const devProcess = await installDependency(container, commands)
        setGeneratingPreview(false)
        return devProcess
    }

    async function runContainer(){
        //remove iframe
        setUrl('')
        //stop devProcess if it exists
        if(devProcess){
            console.log('killing dev process')
            devProcess.kill()
        }
        //clear files in container
        await clearFiles()
        //get file structure and commands to mount
        const {files, commands} = getFilesAndCommandsForWebContainer(currActions, template)
        //mount files
        if(container)
        await container.mount(files);
        //run commands
        const process = await runCommands(commands)
        setDevProcess(process)
    }

    useEffect(()=>{
        let webcontainerInstance:WebContainer|null = null
        async function setup(){
            if(prompts.length > 0){
                console.log('sending the prompt')
                sendPrompts(prompts);
                webcontainerInstance = await initialiseContainer()
            }
            else{
                toast.error('prompts or template not generated')
                router.push('/');
            }
        }
        setup()
        return ()=>{
            if(devProcess)
                devProcess.kill()
            if(webcontainerInstance){
                console.log('killing web container instance')
                webcontainerInstance.teardown()
            }
        }
    }, [])

    useEffect(()=>{
        if(currActions.length > 0 && template && container){
            console.log('mounting files')
            runContainer()
        }
    }, [template, currActions, container])

    return {template, userPromptsAndResponses, currActions, title, url, sendPrompts, generatingCode, generatingPreview}
}