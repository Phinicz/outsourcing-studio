// Supabase Configuration
const SUPABASE_URL = "https://vxmffyxfqxapbrrmpfhd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AdmCIzS3a27ENOLf69-e2g_XZFYH-IX";

// Initialize Supabase client (we'll load this from CDN)
let supabaseClient = null;

// Initialize Supabase
const initSupabase = () => {
  if (typeof window.supabase === "undefined") {
    console.error(
      "Supabase client not loaded. Make sure to include the Supabase CDN script."
    );
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase client initialized");
  }

  return supabaseClient;
};

// Wait for Supabase to be available
const waitForSupabase = () => {
  return new Promise((resolve) => {
    if (typeof window.supabase !== "undefined") {
      resolve(initSupabase());
    } else {
      const checkInterval = setInterval(() => {
        if (typeof window.supabase !== "undefined") {
          clearInterval(checkInterval);
          resolve(initSupabase());
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        console.error("Supabase client failed to load after 5 seconds");
        resolve(null);
      }, 5000);
    }
  });
};

// Export for use in other files
window.getSupabase = () => supabaseClient || initSupabase();
window.waitForSupabase = waitForSupabase;
