const snowContainer = document.getElementById('snow-container');
const numberOfSnowflakes = 50; // Adjust for desired density

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');

    // Randomize size
    const size = Math.random() * 5 + 2; // Between 2px and 7px
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;

    // Randomize starting position
    snowflake.style.left = `${Math.random() * 100}vw`;

    // Randomize animation duration and delay for varied fall speeds
    snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5 to 10 seconds
    snowflake.style.animationDelay = `-${Math.random() * 5}s`; // Stagger start times

    snowContainer.appendChild(snowflake);

    // Remove snowflake after it falls off screen to prevent accumulation
    snowflake.addEventListener('animationiteration', () => {
        snowflake.remove();
        createSnowflake(); // Create a new one to maintain count
    });
}

// Generate initial snowflakes
for (let i = 0; i < numberOfSnowflakes; i++) {
    createSnowflake();
}

document.addEventListener('DOMContentLoaded', () => {
  // Select all anchor tags inside a list item within the div.links
  const linksContainer = document.querySelector('.links');
  if (!linksContainer) {
    console.error("Could not find the '.links' container.");
    return;
  }
  const anchorTags = linksContainer.querySelectorAll('li a');
  const outputContainer = document.getElementById('output');
  if (!outputContainer) {
    console.error("Could not find the '#output' container.");
    return;
  }

  // Iterate over each anchor tag and add a click event listener
  anchorTags.forEach(link => {
    link.addEventListener('click', (event) => {
      // Prevent the default link behavior
      event.preventDefault();

      // Get the data attributes from the clicked link
      const url = link.dataset.url;
      const content = link.dataset.cont;
      const qdesc = link.textContent;

      // Clear any previously generated content
      outputContainer.innerHTML = '';

      // Create the main div element
      const newDiv = document.createElement('div');
      newDiv.id = url; // Use the data-url as the id
      newDiv.classList.add('linkdiv'); // Add the class 'LINKDIV'
      
      // Create the H2 element
      const newH2 = document.createElement('h2');
      newH2.textContent = `contributer: ${content}`; // Use the data-cont as the content
      
      // Create the PRE elem, with the url
      const newPRE = document.createElement('pre');
      const newCODEPRE = document.createElement('code');
      newCODEPRE.textContent = `${url} (${qdesc})`;

      // Create the button element with class CTA
      const newButton = document.createElement('button');
      newButton.textContent = 'Go to Page';
      newButton.className = 'cta';

      // Add a click listener to the button to redirect the user
      newButton.addEventListener('click', () => {
        window.open(url, '_blank');
      });

      // Append the H2 and button to the new div
      newPRE.appendChild(newCODEPRE);
      newDiv.appendChild(newH2);
      newDiv.appendChild(newPRE);
      newDiv.appendChild(newButton);

      // Append the new div to the output container
      outputContainer.appendChild(newDiv);
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const linksDiv = document.querySelector('.links');
  if (!linksDiv) return;

  const listItems = linksDiv.querySelectorAll('li');

  listItems.forEach(async li => {
    const aTag = li.querySelector('a[data-url]');
    if (aTag) {
      const websiteUrl = aTag.getAttribute('data-url');
      const faviconApiUrl = `/get-favicon?url=${encodeURIComponent(websiteUrl)}`;

      try {
        const response = await fetch(faviconApiUrl);
        if (response.ok) {
          const faviconSrc = await response.text();
          const img = document.createElement('img');
          img.src = faviconSrc;
          img.width = 100;
          img.height = 100;
          li.prepend(img); // Add the image before the anchor tag
        } else {
          console.error(`Failed to get favicon for ${websiteUrl}`);
        }
      } catch (error) {
        console.error(`Error fetching favicon for ${websiteUrl}:`, error);
      }
    }
  });
});
