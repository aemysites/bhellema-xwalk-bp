/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to add field hint comment before content
  function fieldHint(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the video embed container (row 2)
  const videoEmbed = element.querySelector('.w-embed-youtubevideo');
  let videoCell;
  if (videoEmbed) {
    const clone = videoEmbed.cloneNode(true);
    // Convert iframe to a link if present
    const iframe = clone.querySelector('iframe');
    if (iframe && iframe.src) {
      const a = document.createElement('a');
      a.href = iframe.src;
      a.textContent = iframe.title || iframe.src;
      iframe.replaceWith(a);
    }
    videoCell = [fieldHint('image', clone)];
  } else {
    videoCell = [''];
  }

  // Compose row 3: richtext (headline, subheading, buttons)
  const richContent = document.createDocumentFragment();

  // Headline (main heading styled as div, fallback to h1)
  const mainHeading = element.querySelector('.h1-heading');
  if (mainHeading) {
    richContent.appendChild(mainHeading.cloneNode(true));
  } else {
    const headline = element.querySelector('h1');
    if (headline) {
      richContent.appendChild(headline.cloneNode(true));
    }
  }

  // Subheading
  const subheading = element.querySelector('p.subheading');
  if (subheading) {
    richContent.appendChild(subheading.cloneNode(true));
  }

  // Button group
  const buttonGroup = element.querySelector('.button-group');
  if (buttonGroup) {
    richContent.appendChild(buttonGroup.cloneNode(true));
  }

  // Compose row 3
  const row3 = [fieldHint('text', richContent)];

  // Compose table rows
  const headerRow = ['Hero (hero25)'];
  const cells = [
    headerRow,
    videoCell,
    row3,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}