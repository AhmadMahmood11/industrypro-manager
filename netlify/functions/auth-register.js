import bcrypt from 'bcryptjs';
import { supabase } from './_utils/supabase.js';
import { badRequest, created, optionsResponse, parseBody, requireFields, serverError } from './_utils/response.js';
import { signToken } from './_utils/auth.js';

export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  if(event.httpMethod!=='POST') return badRequest('Method not allowed');
  try{
    const body=parseBody(event); requireFields(body,['name','email','password']);
    if(body.password.length<6) return badRequest('Password must be at least 6 characters.');
    const {count}=await supabase.from('users').select('id',{count:'exact',head:true});
    const role=count===0?'admin':(['admin','manager','employee'].includes(body.role)?body.role:'employee');
    const password_hash=await bcrypt.hash(body.password,10);
    const {data,error}=await supabase.from('users').insert({name:body.name,email:body.email.toLowerCase(),password_hash,role,status:'active'}).select('id,name,email,role,status,created_at').single();
    if(error) return badRequest(error.message);
    return created({user:data,token:signToken(data)});
  }catch(error){ return serverError(error); }
}
