import bcrypt from 'bcryptjs';
import { supabase } from './_utils/supabase.js';
import { badRequest, ok, optionsResponse, parseBody, requireFields, serverError } from './_utils/response.js';
import { signToken } from './_utils/auth.js';

export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  if(event.httpMethod!=='POST') return badRequest('Method not allowed');
  try{
    const body=parseBody(event); requireFields(body,['email','password']);
    const {data:user,error}=await supabase.from('users').select('*').eq('email',body.email.toLowerCase()).single();
    if(error||!user) return badRequest('Invalid email or password.');
    const valid=await bcrypt.compare(body.password,user.password_hash);
    if(!valid) return badRequest('Invalid email or password.');
    if(user.status!=='active') return badRequest('Your account is inactive.');
    const safe={id:user.id,name:user.name,email:user.email,role:user.role,status:user.status};
    return ok({user:safe,token:signToken(user)});
  }catch(error){ return serverError(error); }
}
