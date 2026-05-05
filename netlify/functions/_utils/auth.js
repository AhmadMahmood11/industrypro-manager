import jwt from 'jsonwebtoken';
import { supabase } from './supabase.js';
const JWT_SECRET=process.env.JWT_SECRET||'dev-secret-change-me';
export function signToken(user){ return jwt.sign({sub:user.id,role:user.role,email:user.email}, JWT_SECRET, {expiresIn:'7d'}); }
export async function getUserFromEvent(event){
  const header=event.headers.authorization||event.headers.Authorization||''; const token=header.startsWith('Bearer ')?header.slice(7):null;
  if(!token) throw Object.assign(new Error('Missing token'),{statusCode:401});
  let payload; try{ payload=jwt.verify(token,JWT_SECRET); }catch{ throw Object.assign(new Error('Invalid or expired token'),{statusCode:401}); }
  const {data,error}=await supabase.from('users').select('id,name,email,role,status,created_at,updated_at').eq('id',payload.sub).single();
  if(error||!data) throw Object.assign(new Error('User not found'),{statusCode:401});
  if(data.status!=='active') throw Object.assign(new Error('User account is inactive'),{statusCode:403});
  return data;
}
export function requireRole(user, roles){ if(!roles.includes(user.role)) throw Object.assign(new Error('You do not have permission for this action'),{statusCode:403}); }
