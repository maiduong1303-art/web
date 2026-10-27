import { neon } from "@neondatabase/serverless";
export default async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ ok: false, error: "Method not allowed" }); }
  if (!process.env.DATABASE_URL) return res.status(503).json({ ok: false, database: "not_configured" });
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`SELECT 1`;
    return res.status(200).json({ ok: true, database: "connected" });
  } catch (error) {
    console.error("GET /api/health failed:", error?.message ?? "Unknown database error");
    return res.status(503).json({ ok: false, database: "unavailable" });
  }
}