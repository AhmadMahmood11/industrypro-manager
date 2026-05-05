import { getUserFromEvent } from './_utils/auth.js';
import { supabase } from './_utils/supabase.js';
import { badRequest, created, forbidden, ok, optionsResponse, parseBody, requireFields, serverError, unauthorized } from './_utils/response.js';
export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  try{const user=await getUserFromEvent(event);
    if(event.httpMethod==='GET'){const {data,error}=await supabase.from('stock_movements').select('*, products(name, sku)').order('movement_date',{ascending:false}).order('created_at',{ascending:false}).limit(200); if(error)return badRequest(error.message); return ok({movements:data});}
    if(event.httpMethod==='POST'){const body=parseBody(event); requireFields(body,['product_id','movement_type','quantity']); const qty=Number(body.quantity||0); if(qty<0)return badRequest('Quantity cannot be negative.'); const {data:product,error:pe}=await supabase.from('products').select('*').eq('id',body.product_id).single(); if(pe||!product)return badRequest('Product not found.'); const previous=Number(product.quantity||0); let next=previous; if(body.movement_type==='stock_in')next=previous+qty; else if(body.movement_type==='stock_out')next=previous-qty; else if(body.movement_type==='adjustment')next=qty; else return badRequest('Invalid movement type.'); if(next<0)return badRequest('Stock cannot go below zero.'); const {error:ue}=await supabase.from('products').update({quantity:next}).eq('id',body.product_id); if(ue)return badRequest(ue.message); const {data,error}=await supabase.from('stock_movements').insert({product_id:body.product_id,movement_type:body.movement_type,quantity:qty,previous_quantity:previous,new_quantity:next,note:body.note||'',movement_date:body.movement_date||new Date().toISOString().slice(0,10),created_by:user.id}).select('*, products(name, sku)').single(); if(error)return badRequest(error.message); return created({movement:data});}
    return badRequest('Method not allowed');
  }catch(error){ if(error.statusCode===401)return unauthorized(error.message); if(error.statusCode===403)return forbidden(error.message); return serverError(error); }
}
