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

  // prepare weaviate query
  // const pathFilter = {"path": ["path"], "operator": "Like", "valueText": path+"*"}
  // const maxDistance = 0.18;
  // var context = "";
  // await client.graphql
  // .get()
  // .withClassName('File_store')
  // .withNearText({
  //   concepts: [query],
  //   distance: maxDistance
  // }).withFields('text _additional { distance }')
  // .withWhere(pathFilter)
  // .withLimit(4)
  // .do()
  // .then(res => {
  //   // for each result in res['data']['Get']['File_store'], log the text and distance
  //   for (let i = 0; i < res['data']['Get']['File_store'].length; i++) {
  //     console.log(res['data']['Get']['File_store'][i]['text']);
  //     // console.log(res['data']['Get']['File_store'][i]['_additional']['distance']);
  //     //add the text to the context
  //     context += `Excerpt ${i+1}: ` + res['data']['Get']['File_store'][i]['text'];
  //   }
  // })
  // .catch(err => {
  //   console.error(err)
  // });


  

  // Send a POST request to the /upload route of the Flask server
  
  // const response = await fetch('https://filestore.visionproje.com/search', {  //change this to server ip
  //   method: 'POST',
  //   body: JSON.stringify({
  //     'path': path,
  //     'query': query
  //   }),
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // });
  // if (!response.ok) {
  //   console.log(`Error: ${response.status}`);
  //   const text = await response.text();
  //   console.log(`Response text: ${text}`);
  //   return new Response(`Error: ${response.status}`, { status: response.status });
  // } 
  // // Get the response data
  // const data = await response.json();
  // console.log(data);
  // return new Response(
  //   JSON.stringify(data),
  //   { headers: {
  //     ...corsHeaders,
  //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  //     "Content-Type": "application/json" 
  //   }},
  // )
});
