import { supabase } from "./supabase.js";

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
  tableName: "Adviser Details",
  avatarBucket: "Avatars",
};

// ==========================================
// STATE
// ==========================================

let advisers = [];

// ==========================================
// DOM ELEMENTS
// ==========================================

const cardHolder = document.getElementById("advisers-card-holder");

// ==========================================
// DATA FUNCTIONS
// ==========================================

// Fetch advisers from Supabase
async function getAdvisers() {
  const { data, error } = await supabase.from(CONFIG.tableName).select("*");

  if (error) {
    console.error("Error fetching advisers:", error);
    return [];
  }

  return data;
}

// Format Supabase data
function formatAdvisers(data) {
  return data.map((adviser) => ({
    Name: adviser.Name,
    Rank: adviser.Rank,
    Position: adviser.Position,
    Avatar: adviser.Avatar_Path,
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

// Create an individual adviser card
function createAdviserCard(adviser) {
  const card = document.createElement("div");
  card.classList.add("card");

  const avatarUrl = getAvatarUrl(adviser.Avatar);

  card.innerHTML = `
    <div class="text">
      <h3></h3>
      <h5></h5>
      <p></p>
    </div>

    <div class="img">
      <img alt="" />
    </div>
  `;

  // Insert adviser information safely
  card.querySelector("h3").textContent = adviser.Name;
  card.querySelector("h5").textContent = adviser.Rank;
  card.querySelector(".text p").textContent = adviser.Position;

  const image = card.querySelector("img");
  image.src = avatarUrl;
  image.alt = adviser.Name;

  return card;
}

// Display advisers
function showAdvisers(advisers) {
  if (!cardHolder) return;

  cardHolder.innerHTML = "";

  const fragment = document.createDocumentFragment();

  advisers.forEach((adviser) => {
    const card = createAdviserCard(adviser);
    fragment.appendChild(card);
  });

  cardHolder.appendChild(fragment);
}

// ==========================================
// INITIALIZATION
// ==========================================

async function initialize() {
  const data = await getAdvisers();

  advisers = formatAdvisers(data);

  showAdvisers(advisers);
}

// Start application
initialize();
