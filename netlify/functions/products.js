import { getUserFromEvent } from './_utils/auth.js';
import { supabase } from './_utils/supabase.js';
import { badRequest, created, forbidden, ok, optionsResponse, parseBody, requireFields, serverError, unauthorized } from './_utils/response.js';
const allowed=['id','name','sku','category','unit','purchase_price','selling_price','quantity','minimum_stock_level','supplier'];
const clean=b=>Object.fromEntries(allowed.filter(k=>k in b).map(k=>[k,b[k]]));
function numeric(p){['purchase_price','selling_price','quantity','minimum_stock_level'].forEach(k=>{if(k in p)p[k]=Number(p[k]||0)});return p;}
export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  try{const user=await getUserFromEvent(event);
    if(event.httpMethod==='GET'){const {data,error}=await supabase.from('products').select('*').order('name'); if(error)return badRequest(error.message); return ok({products:data});}
    if(event.httpMethod==='POST'){const body=parseBody(event); requireFields(body,['name','sku','category','unit','purchase_price','selling_price','quantity','minimum_stock_level']); const {data,error}=await supabase.from('products').insert(numeric({...clean(body),created_by:user.id})).select('*').single(); if(error)return badRequest(error.message); return created({product:data});}
    if(event.httpMethod==='PUT'){const body=parseBody(event); requireFields(body,['id']); const {data,error}=await supabase.from('products').update(numeric(clean(body))).eq('id',body.id).select('*').single(); if(error)return badRequest(error.message); return ok({product:data});}
    if(event.httpMethod==='DELETE'){const id=event.queryStringParameters?.id; if(!id)return badRequest('Missing id'); const {error}=await supabase.from('products').delete().eq('id',id); if(error)return badRequest(error.message); return ok({deleted:true});}
    return badRequest('Method not allowed');
  }catch(error){ if(error.statusCode===401)return unauthorized(error.message); if(error.statusCode===403)return forbidden(error.message); return serverError(error); }
}
