import { getUserFromEvent } from './_utils/auth.js';
import { supabase } from './_utils/supabase.js';
import { badRequest, created, forbidden, ok, optionsResponse, parseBody, requireFields, serverError, unauthorized } from './_utils/response.js';
const allowed=['id','type','category','amount','transaction_date','payment_method','notes'];
const clean=b=>Object.fromEntries(allowed.filter(k=>k in b).map(k=>[k,b[k]]));
export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  try{
    const user=await getUserFromEvent(event);
    if(event.httpMethod==='GET'){const q=event.queryStringParameters||{};let query=supabase.from('transactions').select('*').order('transaction_date',{ascending:false}).order('created_at',{ascending:false}); if(q.type)query=query.eq('type',q.type); if(q.category)query=query.ilike('category',`%${q.category}%`); if(q.startDate)query=query.gte('transaction_date',q.startDate); if(q.endDate)query=query.lte('transaction_date',q.endDate); const {data,error}=await query; if(error)return badRequest(error.message); return ok({transactions:data});}
    if(event.httpMethod==='POST'){const body=parseBody(event); requireFields(body,['type','category','amount','transaction_date']); const payload={...clean(body),amount:Number(body.amount),created_by:user.id}; const {data,error}=await supabase.from('transactions').insert(payload).select('*').single(); if(error)return badRequest(error.message); return created({transaction:data});}
    if(event.httpMethod==='PUT'){const body=parseBody(event); requireFields(body,['id']); const payload=clean(body); if('amount'in payload)payload.amount=Number(payload.amount); const {data,error}=await supabase.from('transactions').update(payload).eq('id',body.id).select('*').single(); if(error)return badRequest(error.message); return ok({transaction:data});}
    if(event.httpMethod==='DELETE'){const id=event.queryStringParameters?.id; if(!id)return badRequest('Missing id'); const {error}=await supabase.from('transactions').delete().eq('id',id); if(error)return badRequest(error.message); return ok({deleted:true});}
    return badRequest('Method not allowed');
  }catch(error){ if(error.statusCode===401)return unauthorized(error.message); if(error.statusCode===403)return forbidden(error.message); return serverError(error); }
}
