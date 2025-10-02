/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to add field comment before content
  function fieldCell(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Table header row
  const headerRow = ['Hero (hero13)'];

  // --- Row 2: Background Image ---
  // Find the main background image (the large image of the person in yellow jacket)
  // It's the first .utility-position-relative > img inside the grid
  const gridDivs = element.querySelectorAll(':scope > div > div');
  let bgImg = null;
  for (const div of gridDivs) {
    const img = div.querySelector('img.cover-image.utility-position-absolute');
    if (img) {
      bgImg = img;
      break;
    }
  }
  // Defensive: If not found, fallback to first img
  if (!bgImg) {
    bgImg = element.querySelector('img');
  }
  // Wrap image in <picture> for best practice
  let bgImgPicture = null;
  if (bgImg) {
    bgImgPicture = document.createElement('picture');
    bgImgPicture.appendChild(bgImg);
  }
  // Add field comment for image (do NOT add for imageAlt)
  let imageCell = bgImgPicture ? fieldCell('image', bgImgPicture) : document.createDocumentFragment();

  // --- Row 3: Text Content ---
  // Find the card body (contains heading, features, and CTA)
  let cardBody = null;
  for (const div of gridDivs) {
    const card = div.querySelector('.card-body');
    if (card) {
      cardBody = card;
      break;
    }
  }
  // Defensive: fallback to first .card-body
  if (!cardBody) {
    cardBody = element.querySelector('.card-body');
  }
  // Compose text content (heading, features, CTA)
  let textContent = null;
  if (cardBody) {
    textContent = document.createElement('div');
    // Heading
    const heading = cardBody.querySelector('h2');
    if (heading) textContent.appendChild(heading);
    // Features (icon + text)
    const features = cardBody.querySelectorAll('.flex-horizontal.flex-gap-xxs');
    features.forEach((feature) => {
      textContent.appendChild(feature);
    });
    // CTA button
    const buttonGroup = cardBody.querySelector('.button-group');
    if (buttonGroup) {
      textContent.appendChild(buttonGroup);
    }
  }
  // Add field comment for text (do NOT add for text field suffixes)
  let textCell = textContent ? fieldCell('text', textContent) : document.createDocumentFragment();

  // Build table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell],
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}