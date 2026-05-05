import { getUserFromEvent, requireRole } from './_utils/auth.js';
import { supabase } from './_utils/supabase.js';
import { badRequest, forbidden, ok, optionsResponse, parseBody, serverError, unauthorized } from './_utils/response.js';
const defaults={business_name:'IndustryPro Manager',currency:'USD',business_address:'',low_stock_alert:true,admin_name:'',admin_email:''};
export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  try{const user=await getUserFromEvent(event);
    if(event.httpMethod==='GET'){let {data,error}=await supabase.from('business_settings').select('*').limit(1).maybeSingle(); if(error)return badRequest(error.message); if(!data){const created=await supabase.from('business_settings').insert(defaults).select('*').single(); if(created.error)return badRequest(created.error.message); data=created.data;} return ok({settings:data});}
    if(event.httpMethod==='PUT'){requireRole(user,['admin']); const body=parseBody(event); const {data:existing}=await supabase.from('business_settings').select('id').limit(1).maybeSingle(); const payload={...defaults,...body}; let result; if(existing?.id)result=await supabase.from('business_settings').update(payload).eq('id',existing.id).select('*').single(); else result=await supabase.from('business_settings').insert(payload).select('*').single(); if(result.error)return badRequest(result.error.message); return ok({settings:result.data});}
    return badRequest('Method not allowed');
  }catch(error){ if(error.statusCode===401)return unauthorized(error.message); if(error.statusCode===403)return forbidden(error.message); return serverError(error); }
}
