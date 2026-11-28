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

const pfp = document.getElementById("pfp");

const assignedHomework = document.getElementById("assigned-homework");
const percentage = document.getElementById("percentage");
const finishedHomework = document.getElementById("finished-homework");

function showProfile(memberData) {
  name.textContent = memberData.Name;
  username.textContent = `@${memberData.User_Name}`;
  rank.textContent = memberData.Rank;
  star.textContent = memberData.Star;
  Class.textContent = memberData.Class;
  department.textContent = memberData.Department;
  roll.textContent = memberData.Roll;
  assignedHomework.textContent = memberData.Assigned_Homework;
  finishedHomework.textContent = memberData.Finished_Homework;
  percentage.textContent = `${(memberData.Finished_Homework / memberData.Assigned_Homework) * 100}%`;

  const contributions = memberData.Contribution;

  const timeline = contributions
    .split(",")
    .map(
      (item) => `
  <div class="timeline-item">
    <p>${item.trim()}</p>
  </div>
`,
    )
    .join("");

  document.querySelector(".timeline").innerHTML = timeline;

  const { data } = supabase.storage
    .from("Avatars")
    .getPublicUrl(memberData.Avatar_Path || "male_pfp.jpg");

  pfp.src = data.publicUrl;
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

let isHorizontal = false;

function resizeCard() {
  const card = document.getElementById("card");

  if (isHorizontal) {
    const originalWidth = 1170;
    const availableWidth = window.innerWidth - 30;
    const scale = Math.min(1, availableWidth / originalWidth);

    card.style.zoom = scale;
  } else {
    // Normal vertical size
    card.style.zoom = 1;
  }
}

window.addEventListener("load", resizeCard);
window.addEventListener("resize", resizeCard);

const layout = document.getElementById("layout");

layout.addEventListener("click", () => {
  const stylesheet = document.getElementById("css");

  if (isHorizontal) {
    stylesheet.setAttribute("href", "./css/vertical.css");
    isHorizontal = false;
  } else {
    stylesheet.setAttribute("href", "./css/horizontal.css");
    isHorizontal = true;
  }

  resizeCard();
});
