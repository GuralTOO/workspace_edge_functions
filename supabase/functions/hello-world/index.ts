import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts"
console.log("Hello from daddy!")

serve(async (req: any) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    // Pre-flight request. Reply successfully:
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      }
    })
  }
  
  const { name } = await req.json()
  console.log('name', name);
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: {
      ...corsHeaders,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Content-Type": "application/json" 
    }},
  )
})
