import { nodeFiles } from "@/utils/nodePrompt";
import { beautificationPrompt, reactFiles } from "@/utils/reactPrompt";
export const getPrompts = (type:'react'|'node', userPrompt:string):string[]=>{
    const prompts:string[] = [];
    let filePrompt = `Project Files:\n\nThe following is a list of all project files and their complete contents that are currently visible and accessible to you.`
    if(type=='react'){
        filePrompt+=`${reactFiles}`
    }
    else if(type=='node'){
        filePrompt+=`${nodeFiles}`
    }
    filePrompt+=`Here is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json`
    prompts.push(filePrompt);
    if(type=='react')
        prompts.push(beautificationPrompt)
    prompts.push(userPrompt)
    return prompts;
}