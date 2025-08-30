const themeToggle = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  themeToggle.innerHTML = currentTheme === "dark"
    ? '<i class="ri-moon-fill"></i> Light Mode'
    : '<i class="ri-moon-line"></i> Dark Mode';
}

themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.getAttribute("data-theme");
  const newTheme = theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeToggle.innerHTML = newTheme === "dark"
    ? '<i class="ri-moon-fill"></i> Light Mode'
    : '<i class="ri-moon-line"></i> Dark Mode';
});

const countriesContainer = document.getElementById("countries-container");
const countryDetail = document.getElementById("country-detail");
const searchInput = document.getElementById("search-input");
const regionFilter = document.getElementById("region-filter");

let countriesData = [];

async function fetchCountries() {
  try {
    // Usando o data.json local
    const res = await fetch("data.json");
    countriesData = await res.json();
    displayCountries(countriesData);
  } catch (error) {
    countriesContainer.innerHTML = "<p>Failed to load data.</p>";
    console.error(error);
  }
}

function displayCountries(countries) {
  countriesContainer.innerHTML = "";

  if (!countries.length) {
    countriesContainer.innerHTML = "<p>No countries found.</p>";
    return;
  }

  countries.forEach(country => {
    const card = document.createElement("article");
    card.classList.add("country-card");
    card.setAttribute("tabindex", "0");

    card.innerHTML = `
      <img src="${country.flags.png}" alt="Flag of ${country.name}">
      <div class="info">
        <h2>${country.name}</h2>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital || "N/A"}</p>
      </div>
    `;

    card.addEventListener("click", () => showCountryDetail(country));
    countriesContainer.appendChild(card);
  });
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove acentos
}

function filterCountries() {
  const searchTerm = normalizeText(searchInput.value.trim());
  const region = regionFilter.value;

  let filtered = countriesData.filter(c =>
    normalizeText(c.name).includes(searchTerm)
  );

  if (region) {
    filtered = filtered.filter(c => c.region.toLowerCase() === region);
  }

  displayCountries(filtered);
}

searchInput.addEventListener("input", filterCountries);
regionFilter.addEventListener("change", filterCountries);

function showCountryDetail(country) {
  countriesContainer.classList.add("hidden");
  countryDetail.classList.remove("hidden");

  countryDetail.innerHTML = `
    <button id="back-btn"><i class="ri-arrow-left-line"></i> Back</button>
    <div class="country-info">
      <div class="flag">
        <img src="${country.flags.png}" alt="Flag of ${country.name}">
      </div>
      <div class="details">
        <h1>${country.name}</h1>
        <ul>
          <li><strong>Native Name:</strong> ${country.nativeName}</li>
          <li><strong>Population:</strong> ${country.population.toLocaleString()}</li>
          <li><strong>Region:</strong> ${country.region}</li>
          <li><strong>Sub Region:</strong> ${country.subregion || "N/A"}</li>
          <li><strong>Capital:</strong> ${country.capital || "N/A"}</li>
          <li><strong>Top Level Domain:</strong> ${country.topLevelDomain.join(", ")}</li>
          <li><strong>Currencies:</strong> ${country.currencies?.map(c => c.name).join(", ") || "N/A"}</li>
          <li><strong>Languages:</strong> ${country.languages.map(l => l.name).join(", ")}</li>
        </ul>
        <div class="country-borders">
          <strong>Border Countries:</strong>
          ${country.borders?.length
            ? country.borders.map(b => `<span>${b}</span>`).join("")
            : "None"}
        </div>
      </div>
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    countryDetail.classList.add("hidden");
    countriesContainer.classList.remove("hidden");
  });
}

fetchCountries();