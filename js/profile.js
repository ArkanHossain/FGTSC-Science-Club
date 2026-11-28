import { supabase } from "./supabase.js";

// Get parameters from URL
const params = new URLSearchParams(window.location.search);

const id = params.get("id");
const usernameParam = params.get("user");

// Select elements
const name = document.getElementById("name");
const rank = document.getElementById("rank");
const username = document.getElementById("username");
const star = document.getElementById("star");
const Class = document.getElementById("class");
const department = document.getElementById("department");
const roll = document.getElementById("roll");

function showProfile(memberData) {
  name.textContent = memberData.Name;
  username.textContent = `@${memberData.User_Name}`;
  rank.textContent = memberData.Rank;
  star.textContent = memberData.Star;
  Class.textContent = memberData.Class;
  department.textContent = memberData.Department;
  roll.textContent = memberData.Roll;
}

// Fetch member data
async function getMember() {
  if (!id && !usernameParam) {
    console.error("Member ID or username is missing.");
    return;
  }

  let query = supabase.from("Member Details").select("*");

  if (id) {
    query = query.eq("Id", id);
  } else if (usernameParam) {
    const cleanUsername = usernameParam.replace(/^@/, "");

    query = query.eq("User_Name", cleanUsername);
  }

  const { data: member, error } = await query.single();

  if (error) {
    console.error("Error fetching member:", error);
    document.getElementById("status").textContent = "Member not found.";
    return;
  }

  showProfile(member);
}

getMember();
