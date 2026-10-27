import { neon } from "@neondatabase/serverless";
export default async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Method not allowed" }); }
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: "Database is not configured" });
  try {
    const sql = neon(process.env.DATABASE_URL);
    const q = String(req.query?.q ?? "").trim().slice(0, 100);
    const pattern = `%${q}%`;
    const places = await sql`
      SELECT slug, name, category, image_url AS "imageUrl", image_alt AS "imageAlt",
             tags, description, detail, quote
      FROM public.tourist_places
      WHERE is_published = true AND (
        ${q} = '' OR name ILIKE ${pattern} OR category ILIKE ${pattern}
        OR description ILIKE ${pattern} OR detail ILIKE ${pattern} OR ${q} = ANY(tags)
      )
      ORDER BY sort_order ASC, name ASC LIMIT 50
    `;
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ places });
  } catch (error) {
    console.error("GET /api/places failed:", error?.message ?? "Unknown database error");
    return res.status(500).json({ error: "Unable to load places right now" });
  }
}