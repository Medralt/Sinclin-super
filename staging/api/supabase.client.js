const { createClient } = require("@supabase/supabase-js");

let client = null;

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (url && key) {
  try {
    client = createClient(url, key, { auth: { persistSession: false } });
    console.log("[SINCLIN] Supabase client OK");
  } catch (e) {
    console.warn("[SINCLIN] Supabase client falhou:", e.message);
  }
} else {
  console.warn("[SINCLIN] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente — sessões em memória apenas");
}

module.exports = client;
