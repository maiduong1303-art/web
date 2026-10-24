import { neon } from '@neondatabase/serverless';
export default async function handler(req,res){
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed'});}
 const url=process.env.DATABASE_URL;if(!url)return res.status(503).json({error:'Service temporarily unavailable'});
 try{const sql=neon(url);const q=typeof req.query?.q==='string'?req.query.q.trim().slice(0,100):'';let rows;
 if(q){const p='%'+q.replace(/[\\%_]/g,'\\$&')+'%';rows=await sql`SELECT slug,name,category,image_url,image_alt,tags,description,detail,quote FROM tourist_places WHERE is_published=TRUE AND (name ILIKE ${p} OR category ILIKE ${p} OR description ILIKE ${p} OR detail ILIKE ${p} OR EXISTS(SELECT 1 FROM unnest(tags) AS tag WHERE tag ILIKE ${p})) ORDER BY sort_order,name LIMIT 50`;}
 else{rows=await sql`SELECT slug,name,category,image_url,image_alt,tags,description,detail,quote FROM tourist_places WHERE is_published=TRUE ORDER BY sort_order,name LIMIT 50`;}
 return res.status(200).json({places:rows.map(r=>({slug:r.slug,name:r.name,category:r.category,imageUrl:r.image_url,imageAlt:r.image_alt,tags:r.tags,description:r.description,detail:r.detail,quote:r.quote}))});
 }catch{return res.status(500).json({error:'Unable to load destinations right now'});}
}