'use client'

import Loader from "./Loader"

const WebContainerComponent = ({url}:{url:string}) => {

  return (
    <div className='w-full h-full'>
        {url ? <iframe className="w-full h-full border rounded" src={url}/>
        :
        <div className="w-full h-full flex justify-center items-center bg-white"><Loader/></div>
        }
    </div>
  )
}

export default WebContainerComponent