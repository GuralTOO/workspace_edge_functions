import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";


const { fetch } = window;


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
  
  const requestData = await req.json();
  var { path } = requestData;

  const response = await fetch('https://filestore.visionproje.com/delete', {  //change this to server ip
    method: 'POST',
    body: JSON.stringify({
      'path': path,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    console.log(`Error: ${response.status}`);
    const text = await response.text();
    console.log(`Response text: ${text}`);
    return new Response(`Error: ${response.status}`, { status: response.status });
  } 
  // Get the response data
  const data = await response.json();
  console.log(data);
  return new Response(
    JSON.stringify(data),
    { headers: {
      ...corsHeaders,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Content-Type": "application/json" 
    }},
  )
})