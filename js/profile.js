import { supabase } from "./supabase.js";

// Get member ID from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Fetch member data
async function getMember() {
  if (!id) {
    console.error("Member ID is missing from URL.");
    return;
  }

  const { data: member, error } = await supabase
    .from("Member Details")
    .select("*")
    .eq("Id", id)
    .single();

  if (error) {
    console.error("Error fetching member:", error);
    document.getElementById("status").textContent = "Member not found.";
    return;
  }
}

getMember();
