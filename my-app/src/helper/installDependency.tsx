import { WebContainer } from "@webcontainer/api";

export async function installDependency(container: WebContainer, commands:string[]) {
    let i=0;
    for(i;i<commands.length-1;i++){
        const command = commands[i].split(' ');
        console.log(`▶ Running: ${command.join(' ')}`);

        const process = await container.spawn(command[0], command.slice(1))
        process.output.pipeTo(new WritableStream({
            write(data) {
                console.log(`[${command}]`, data);
            }
        }));
        
        const exitCode = await process.exit;
        if (exitCode !== 0) {
            console.error(`❌ Command failed: ${command.join(' ')}`);
            break;
        }
    }
    //start the server for last command 
    const command = commands[i].split(' ')
    const process = await container.spawn(command[0], command.slice(1))
    process.output.pipeTo(new WritableStream({
        write(data) {
            console.log(`[${command}]`, data);
        }
    }));
    return process
}
