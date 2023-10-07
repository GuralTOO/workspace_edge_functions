// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

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
  
  // get file data from browser request
  const requestData = await req.json();
  var { type, path, url, contentType } = requestData;

  const response = await fetch('https://filestore.visionproje.com/upload', {  //change this to server ip
    method: 'POST',
    body: JSON.stringify({
      'type': type,
      'path': path,
      'url': url,
      'contentType': contentType
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
});
// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
