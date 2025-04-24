//we wont be using this api endpoint for our chat endpoint as it would be slow to make api call. Directly use a function
import { getPrompts } from "@/helper/getPrompts";
import { typeOfProject } from "@/helper/typeOfProject";
import { nodeFiles } from "@/utils/nodePrompt";
import { reactFiles } from "@/utils/reactPrompt";
import { NextRequest } from "next/server";

export const POST = async (req:NextRequest)=>{
    const {userPrompt}:{userPrompt:string} = await req.json();
    const res = await typeOfProject(userPrompt);
    if(res != 'react' && res !='node'){
        return Response.json({success:false, message:'not able to generate output'}, {status:400})
    }
    const prompts:string[] = getPrompts(res, userPrompt);
    if(res=='react'){
        return Response.json({success:true, message:'prompts generated', prompts, files:reactFiles}, {status:200})
    }
    else{
        return Response.json({success:true, message:'prompts generated', prompts, files:nodeFiles}, {status:200})
    }
}