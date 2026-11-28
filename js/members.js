import { supabase } from "./supabase.js";

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
  visibleCards: 3,
  initialHidden: true,
  tableName: "Member Details",
  avatarBucket: "Avatars",
};

// ==========================================
// STATE
// ==========================================

let members = [];
let hidden = CONFIG.initialHidden;

// ==========================================
// DOM ELEMENTS
// ==========================================

const cardHolder = document.getElementById("community-card-holder");
const seeAll = document.getElementById("see-all");

// ==========================================
// DATA FUNCTIONS
// ==========================================

// Fetch members from Supabase
async function getMembers() {
  const { data, error } = await supabase
    .from(CONFIG.tableName)
    .select("*")
    .order("Id", { ascending: true });

  if (error) {
    console.error("Error fetching members:", error);
    return [];
  }

  return data;
}

// Format Supabase data
function formatMembers(data) {
  return data.map((member) => ({
    Id: member.Id,
    Name: member.Name,
    Rank: member.Rank,
    Class: String(member.Class),
    Department: member.Department,
    Star: member.Star,
    Avatar: member.Avatar_Path,
  }));
}

// ==========================================
// AVATAR FUNCTIONS
// ==========================================

// Get public avatar URL
function getAvatarUrl(avatarPath) {
  const { data } = supabase.storage
    .from(CONFIG.avatarBucket)
    .getPublicUrl(avatarPath);

  return data.publicUrl;
}

// ==========================================
// CARD FUNCTIONS
// ==========================================

// Create an individual member card
function createMemberCard(member) {
  const card = document.createElement("div");
  card.classList.add("card");

  const avatarUrl = getAvatarUrl(member.Avatar);

  card.innerHTML = `
    <div class="img">
      <img src="${avatarUrl}" />
    </div>

    <div class="text">
      <h3>${member.Name}</h3>
      <h5>${member.Rank}</h5>
      <p>${member.Class} - ${member.Department}</p>
      <p>${member.Star}</p>
      <h5 class="see-profile">See Profile</h5>
    </div>
  `;

  return card;
}

// Control initial card visibility
function hide(card, index) {
  if (hidden && index >= CONFIG.visibleCards) {
    card.classList.add("hidden");
  }
}

// Display members
function showMembers(members) {
  if (!cardHolder) return;

  cardHolder.innerHTML = "";

  const fragment = document.createDocumentFragment();

  members.forEach((member, index) => {
    const card = createMemberCard(member);

    hide(card, index);

    fragment.appendChild(card);
  });

  cardHolder.appendChild(fragment);
}

// ==========================================
// SEE ALL / SEE LESS
// ==========================================

function handleSeeAll(event) {
  event.preventDefault();

  hidden = !hidden;

  const cards = cardHolder.querySelectorAll(".card");

  cards.forEach((card, index) => {
    if (index >= CONFIG.visibleCards) {
      card.classList.toggle("hidden", hidden);
    }
  });

  const seeAllText = seeAll.querySelector("p");

  if (seeAllText) {
    seeAllText.textContent = hidden ? "See All" : "See Less";
  }
}

// Initialize See All button
function initializeSeeAll() {
  if (!seeAll || !cardHolder) return;

  seeAll.addEventListener("click", handleSeeAll);
}

// ==========================================
// INITIALIZATION
// ==========================================

async function initialize() {
  initializeSeeAll();

  const data = await getMembers();

  members = formatMembers(data);

  showMembers(members);
}

// Start application
initialize();
