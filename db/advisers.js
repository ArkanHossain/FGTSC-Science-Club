import { supabase } from "./supabase.js";

// Variables
let advisers = [];

// Display Advisers
function showAdvisers(advisers) {
  const cardHolder = document.getElementById("advisers-card-holder");

  advisers.forEach((adviser) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const { data: avatarData } = supabase.storage
      .from("Avatars")
      .getPublicUrl(adviser.Avatar);

    const avatarUrl = avatarData.publicUrl;

    card.innerHTML = `
      <div class="text">
        <h3>${adviser.Name}</h3>
        <h5>${adviser.Rank}</h5>
        <p>${adviser.Position}</p>
      </div>

      <div class="img">
        <img
          src="${avatarUrl}"
          alt=""
        />
      </div>
    `;

    cardHolder.appendChild(card);
  });
}

// Fetch Advisers from Supabase
async function getAdvisers() {
  const { data, error } = await supabase.from("Adviser Details").select("*");

  if (error) {
    console.log(error);
    return;
  }

  advisers = data.map((adviser) => ({
    Name: adviser.Name,
    Rank: adviser.Rank,
    Position: adviser.Position,
    Avatar: adviser.Avatar_Path,
  }));

  showAdvisers(advisers);
}

// Initialize
getAdvisers();
