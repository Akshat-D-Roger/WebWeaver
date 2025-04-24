import { boltAction } from "@/types/boltAction";
import {FileSystemTree} from '@webcontainer/api'

export function getFilesAndCommandsForWebContainer(addedFiles:boltAction[], templateFiles:boltAction[]){
    const actions = [...addedFiles];
    templateFiles.forEach(tfile => {
        const name = tfile.filePath
        if(!(actions.find(item => item.filePath===name)))
            actions.push(tfile);
    })
    const files:FileSystemTree = {};
    const commands = [];
    for(const action of actions){
        if(action.type==='shell'){
            commands.push(action.content)
        }
        else{
            const name = action.filePath as string;
            const parts = name.split('/')
            let curr = files;
            parts.forEach((part, index)=>{
                if(index===parts.length-1){
                    curr[part] = {
                        file:{
                            contents:action.content
                        }
                    }
                }
                else{
                    if(!curr[part]){
                        curr[part] = {
                            directory:{}
                        }
                    }
                    if ('directory' in curr[part]) {
                        curr = curr[part].directory;
                    } else {
                        throw new Error(`Expected '${part}' to be a directory.`);
                    }
                }
            })
        }
    }
    return {commands, files}

}