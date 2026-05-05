export const headers = {
  'Content-Type':'application/json',
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'Content-Type, Authorization',
  'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS'
};
export function json(statusCode, body){ return { statusCode, headers, body: JSON.stringify(body) }; }
export const ok=(body={})=>json(200,body);
export const created=(body={})=>json(201,body);
export const badRequest=(message,details)=>json(400,{message,details});
export const unauthorized=(message='Unauthorized')=>json(401,{message});
export const forbidden=(message='Forbidden')=>json(403,{message});
export const serverError=(error)=>json(500,{message:error.message||'Server error'});
export const optionsResponse=()=>({statusCode:204,headers,body:''});
export function parseBody(event){ if(!event.body) return {}; try{return JSON.parse(event.body);}catch{throw new Error('Invalid JSON body');} }
export function requireFields(body, fields){ const missing=fields.filter(f=>body[f]===undefined||body[f]===null||body[f]===''); if(missing.length) throw new Error(`Missing required fields: ${missing.join(', ')}`); }
