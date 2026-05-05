import { getUserFromEvent, requireRole } from './_utils/auth.js';
import { supabase } from './_utils/supabase.js';
import { badRequest, created, forbidden, ok, optionsResponse, parseBody, requireFields, serverError, unauthorized } from './_utils/response.js';
const allowed=['id','name','phone','email','department','designation','joining_date','salary_type','salary_amount','status'];
function clean(b){const p=Object.fromEntries(allowed.filter(k=>k in b).map(k=>[k,b[k]])); if('salary_amount'in p)p.salary_amount=Number(p.salary_amount||0); return p;}
export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  try{const user=await getUserFromEvent(event); requireRole(user,['admin','manager']);
    if(event.httpMethod==='GET'){const {data,error}=await supabase.from('employees').select('*').order('name'); if(error)return badRequest(error.message); return ok({employees:data});}
    if(event.httpMethod==='POST'){const body=parseBody(event); requireFields(body,['name','joining_date','salary_type','salary_amount']); const {data,error}=await supabase.from('employees').insert(clean(body)).select('*').single(); if(error)return badRequest(error.message); return created({employee:data});}
    if(event.httpMethod==='PUT'){const body=parseBody(event); requireFields(body,['id']); const {data,error}=await supabase.from('employees').update(clean(body)).eq('id',body.id).select('*').single(); if(error)return badRequest(error.message); return ok({employee:data});}
    if(event.httpMethod==='DELETE'){const id=event.queryStringParameters?.id; if(!id)return badRequest('Missing id'); const {error}=await supabase.from('employees').delete().eq('id',id); if(error)return badRequest(error.message); return ok({deleted:true});}
    return badRequest('Method not allowed');
  }catch(error){ if(error.statusCode===401)return unauthorized(error.message); if(error.statusCode===403)return forbidden(error.message); return serverError(error); }
}
