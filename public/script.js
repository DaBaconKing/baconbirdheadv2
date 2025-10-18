AOS.init({ duration: 800 });

function toggleTheme() {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "light" ? "dark" : "light";
}

const AUTH_CODE = "MGEFDHGIERHGOIUE-/BACON4LIFE";
const PROXY_URL = "https://bacongames/api/siteinfo";

document.querySelectorAll('.card').forEach(async card => {
  const targetURL = card.getAttribute('data-URL');
  if (!targetURL) return;

  try {
    // 🔥 Fetch metadata from your proxy
    const response = await fetch(`${PROXY_URL}?target=${encodeURIComponent(targetURL)}`, {
      headers: {
        "x-auth-code": AUTH_CODE
      }
    });

    if (!response.ok) throw new Error("Metadata fetch failed");

    const { title, description, favicon } = await response.json();

    // 🖼️ Inject favicon
    card.querySelector('.card-img').src = favicon || "";

    // 🧠 Inject title
    card.querySelector('.card-sitetitle').innerText = title || "Untitled";

    // 📝 Inject description
    const descElem = card.querySelector('.card-sitedesc');
    if (description) {
      descElem.innerText = description;
    } else {
      descElem.innerText = "No description available.";
      descElem.classList.add("empty");
    }

    // 🔗 Set play button href
    card.querySelector('.card-playbutton').href = targetURL;

  } catch (err) {
    console.warn(`Failed to load metadata for ${targetURL}`, err);
    card.querySelector('.card-sitetitle').innerText = "Failed to load";
    const descElem = card.querySelector('.card-sitedesc');
    descElem.innerText = "No description available.";
    descElem.classList.add("empty");
    card.querySelector('.card-img').style.backgroundColor = "#ccc";
  }
});

const scrollBtn = document.getElementById('scrollTopBtn');
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
);
