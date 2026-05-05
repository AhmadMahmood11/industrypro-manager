function escapeCell(v){ if(v===null||v===undefined) return ''; const t=String(v).replace(/"/g,'""'); return /[",\n]/.test(t)?`"${t}"`:t; }
export function downloadCSV(filename, rows=[]){
  if(!rows.length){ alert('No data to export.'); return; }
  const headers=Object.keys(rows[0]); const csv=[headers.join(','), ...rows.map(r=>headers.map(h=>escapeCell(typeof r[h]==='object'&&r[h]!==null?JSON.stringify(r[h]):r[h])).join(','))].join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}
