import { messagePromptsType } from "@/types/messagePromptsType";
import { getSystemPrompt } from "@/utils/systemPrompt";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest){
    const {messagePrompts}:{messagePrompts:messagePromptsType[]} = await req.json();

    const {text} = await generateText({ 
        model:google('gemini-2.0-flash'),
        maxTokens:20000,
        system:getSystemPrompt(),
        temperature:0.95,
        messages:messagePrompts
    })
    return Response.json({success:true, text})
}