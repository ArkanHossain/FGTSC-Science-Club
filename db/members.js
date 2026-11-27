import { supabase } from "./supabase.js";

// Variables
let members = [];
let hidden = true;
let visibleCards = 3;

// DOMs
const seeAll = document.getElementById("see-all");

if (seeAll) {
  const seeAllText = seeAll.querySelector("p");

  seeAll.addEventListener("click", (event) => {
    event.preventDefault();

    hidden = !hidden;

    const cards = document.querySelectorAll(
      "#community-card-holder .card"
    );

    cards.forEach((card, index) => {
      if (index >= visibleCards) {
        card.classList.toggle("hidden", hidden);
      }
    });

    seeAllText.textContent = hidden ? "See All" : "See Less";
  });
}

// Hide / Show Cards
function hide(card, index) {
  if (hidden) {
    if (index >= visibleCards) {
      card.classList.add("hidden");
    }
  } else {
    let hiddenCards = document.querySelectorAll(
      "#community-card-holder .hidden",
    );

    hiddenCards.forEach((hiddenCard) => {
      hiddenCard.classList.remove("hidden");
    });
  }
}

// Display Members
function showMembers(members) {
  const cardHolder = document.getElementById("community-card-holder");

  members.forEach((member, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const { data: avatarData } = supabase.storage
      .from("Avatars")
      .getPublicUrl(member.Avatar);

    const avatarUrl = avatarData.publicUrl;

    card.innerHTML = `
      <div class="img">
        <img
          src="${avatarUrl}"
          alt="${member.Name}"
        />
      </div>

      <div id="text">
        <h3>${member.Name}</h3>
        <h5>${member.Rank}</h5>
        <p>${member.Class} - ${member.Department}</p>
        <p>${member.Star}</p>
      </div>
    `;

    hide(card, index);
    cardHolder.appendChild(card);
  });
}

// Fetch Members from Supabase
async function getMembers() {
  const { data, error } = await supabase
    .from("Member Details")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.log(error);
    return;
  }

  members = data.map((member) => ({
    Name: member.Name,
    Rank: member.Rank,
    Class: String(member.Class),
    Department: member.Department,
    Star: member.Star,
    Avatar: member.Avatar_Path,
  }));

  showMembers(members);
}

// Initialize
getMembers();
