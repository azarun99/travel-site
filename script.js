const input = document.getElementById("searchInput");
const resultsBox = document.getElementById("results");

function show(items) {
  if (!resultsBox) return;
  if (!items.length) {
    resultsBox.innerHTML = '<p class="empty">No results found. Try "beach", "temple", "Australia", "Japan" or "Brazil".</p>';
    return;
  }
  resultsBox.innerHTML = items.map(i =>
    `<div class="card"><img src="${i.imageUrl}" alt="${i.name}"><div><h3>${i.name}</h3><p>${i.description}</p></div></div>`
  ).join("");
}

async function search() {
  if (!resultsBox) { window.location.href = "index.html"; return; }
  const q = input.value.trim().toLowerCase();
  if (!q) { show([]); return; }
  try {
    const res = await fetch("travel_recommendation_api.json");
    const data = await res.json();
    let out = [];
    if (q.includes("beach")) out = data.beaches;
    else if (q.includes("temple")) out = data.temples;
    else {
      const country = data.countries.find(c => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase()));
      if (country) out = country.cities;
    }
    show(out);
  } catch (e) {
    console.error(e);
    resultsBox.innerHTML = '<p class="empty">Could not load recommendations.</p>';
  }
}

function clearResults() {
  input.value = "";
  if (resultsBox) resultsBox.innerHTML = "";
}

document.getElementById("searchBtn").addEventListener("click", search);
document.getElementById("clearBtn").addEventListener("click", clearResults);
input.addEventListener("keydown", e => { if (e.key === "Enter") search(); });

const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("formMsg").textContent = "Thank you! Your message has been sent.";
    form.reset();
  });
}
