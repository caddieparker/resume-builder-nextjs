import { supabase } from "../../../lib/supabaseClient";

export const getUserSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error.message);
    return null;
  }
  console.log("session", session);
  return session?.user;
};
