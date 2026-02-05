"use server"
import { inngest } from "@/inngest/client"
export const onInvokeAgent=async()=>{
     await inngest.send({
      name:"agent/hello",
       })   
    }