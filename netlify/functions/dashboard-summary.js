import { getUserFromEvent } from './_utils/auth.js';
import { supabase } from './_utils/supabase.js';
import { badRequest, forbidden, ok, optionsResponse, serverError, unauthorized } from './_utils/response.js';
export async function handler(event){
  if(event.httpMethod==='OPTIONS') return optionsResponse();
  try{await getUserFromEvent(event); const today=new Date().toISOString().slice(0,10);
    const [settingsRes,transactionsRes,productsRes,employeesRes,attendanceRes,payrollRes,stockRes]=await Promise.all([
      supabase.from('business_settings').select('*').limit(1).maybeSingle(),
      supabase.from('transactions').select('*').order('created_at',{ascending:false}),
      supabase.from('products').select('*'),
      supabase.from('employees').select('*'),
      supabase.from('attendance').select('*').eq('attendance_date',today),
      supabase.from('payroll').select('*').eq('status','unpaid'),
      supabase.from('stock_movements').select('*, products(name, sku)').order('created_at',{ascending:false}).limit(8)
    ]);
    const error=[settingsRes,transactionsRes,productsRes,employeesRes,attendanceRes,payrollRes,stockRes].find(r=>r.error)?.error; if(error)return badRequest(error.message);
    const transactions=transactionsRes.data||[], products=productsRes.data||[], employees=employeesRes.data||[], attendance=attendanceRes.data||[], payroll=payrollRes.data||[];
    const totalIncome=transactions.filter(t=>t.type==='income').reduce((s,t)=>s+Number(t.amount||0),0);
    const totalExpenses=transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount||0),0);
    const totalStockValue=products.reduce((s,p)=>s+Number(p.quantity||0)*Number(p.purchase_price||0),0);
    const lowStockCount=products.filter(p=>Number(p.quantity||0)<=Number(p.minimum_stock_level||0)).length;
    const activeEmployees=employees.filter(e=>e.status==='active');
    const presentToday=attendance.filter(a=>['present','late','half_day'].includes(a.status)).length;
    const absentToday=Math.max(activeEmployees.length-presentToday, attendance.filter(a=>a.status==='absent').length);
    const pendingSalary=payroll.reduce((s,p)=>s+Number(p.net_salary||0),0);
    return ok({settings:settingsRes.data,totalIncome,totalExpenses,netProfit:totalIncome-totalExpenses,totalStockValue,lowStockCount,totalEmployees:activeEmployees.length,presentToday,absentToday,pendingSalary,recentTransactions:transactions.slice(0,8),recentStockActivity:stockRes.data||[]});
  }catch(error){ if(error.statusCode===401)return unauthorized(error.message); if(error.statusCode===403)return forbidden(error.message); return serverError(error); }
}
