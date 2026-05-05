import { getUserFromEvent } from './_utils/auth.js';
import { forbidden, ok, optionsResponse, serverError, unauthorized } from './_utils/response.js';
export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  try{ const user=await getUserFromEvent(event); return ok({user}); }
  catch(error){ if(error.statusCode===401) return unauthorized(error.message); if(error.statusCode===403) return forbidden(error.message); return serverError(error); }
}
