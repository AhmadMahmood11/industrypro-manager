import { getUserFromEvent, requireRole } from './_utils/auth.js';
import { supabase } from './_utils/supabase.js';
import { badRequest, created, forbidden, ok, optionsResponse, parseBody, requireFields, serverError, unauthorized } from './_utils/response.js';
function monthBounds(month){const [y,m]=month.split('-').map(Number);return{start:new Date(Date.UTC(y,m-1,1)).toISOString().slice(0,10),end:new Date(Date.UTC(y,m,0)).toISOString().slice(0,10)};}
export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  try{const user=await getUserFromEvent(event); requireRole(user,['admin','manager']);
    if(event.httpMethod==='GET'){const q=event.queryStringParameters||{}; let query=supabase.from('attendance').select('*, employees(name, department, designation)').order('attendance_date',{ascending:false}); if(q.month){const b=monthBounds(q.month); query=query.gte('attendance_date',b.start).lte('attendance_date',b.end);} if(q.date)query=query.eq('attendance_date',q.date); if(q.employee_id)query=query.eq('employee_id',q.employee_id); const {data,error}=await query; if(error)return badRequest(error.message); return ok({attendance:data});}
    if(event.httpMethod==='POST'){const body=parseBody(event); requireFields(body,['employee_id','attendance_date','status']); const payload={employee_id:body.employee_id,attendance_date:body.attendance_date,status:body.status,overtime_hours:Number(body.overtime_hours||0),check_in_time:body.check_in_time||null,check_out_time:body.check_out_time||null,notes:body.notes||'',marked_by:user.id}; const {data,error}=await supabase.from('attendance').upsert(payload,{onConflict:'employee_id,attendance_date'}).select('*, employees(name, department, designation)').single(); if(error)return badRequest(error.message); return created({attendance:data});}
    if(event.httpMethod==='PUT'){const body=parseBody(event); requireFields(body,['id']); const payload={...body}; delete payload.id; if('overtime_hours'in payload)payload.overtime_hours=Number(payload.overtime_hours||0); const {data,error}=await supabase.from('attendance').update(payload).eq('id',body.id).select('*').single(); if(error)return badRequest(error.message); return ok({attendance:data});}
    if(event.httpMethod==='DELETE'){const id=event.queryStringParameters?.id; if(!id)return badRequest('Missing id'); const {error}=await supabase.from('attendance').delete().eq('id',id); if(error)return badRequest(error.message); return ok({deleted:true});}
    return badRequest('Method not allowed');
  }catch(error){ if(error.statusCode===401)return unauthorized(error.message); if(error.statusCode===403)return forbidden(error.message); return serverError(error); }
}
