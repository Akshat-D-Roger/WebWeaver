'use client'
import { toast } from "sonner";
import FormSubmit from "@/components/FormSubmit";
import { getTemplate } from "@/actions";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { parseBoltArtifact } from "@/helper/parseBoltArtifact";

export default function Home() {
  const router = useRouter();
  const {setTemplate, setPrompts, setUserPromptsAndResponses} = useStore()

  async function onSubmitHandler(formData:FormData){
    const res = await getTemplate(formData);
    if(!res.success){
      toast.error(res.message)
    }
    else{
      toast(res.message);
      setUserPromptsAndResponses([{type:'prompt', content:formData.get('prompt') as string}])
      const files = res.files as string;
      setTemplate(parseBoltArtifact(files).actions);
      const prompts = res.prompts as string[];
      setPrompts(prompts);
      router.push('/builder');
    }
  }

  return (
    <div className="w-full h-full p-[1rem] flex flex-col">
      <div className="text-3xl sm:text-7xl text-center font-bold pt-[2rem]">WEB WEAVER</div>
      <div className="w-full grow flex justify-center items-center">
        <form action={onSubmitHandler} className="flex flex-col w-full max-w-lg items-center justify-center gap-[1rem]">
          <textarea name="prompt" id="prompt" className="w-full rounded-md border min-h-[10rem] p-[1rem]" placeholder="create a portfolio website..."></textarea>
          <FormSubmit text="Generate Project"/>
        </form>
      </div>
    </div>
  );
}
