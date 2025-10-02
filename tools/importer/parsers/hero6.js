/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to add field comment before content
  function withFieldComment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Table header row (block name)
  const headerRow = ['Hero (hero6)'];

  // --- Row 2: Background Image ---
  // Find the image element (background)
  let img = element.querySelector('img');
  let imgCell = '';
  if (img) {
    // Use the image directly, no field comment for collapsed fields (imageAlt)
    imgCell = withFieldComment('image', img);
  }

  // --- Row 3: Content (headline, subheading, CTA) ---
  // Find the card overlay containing text and buttons
  let card = element.querySelector('.card');
  let contentCell = '';
  if (card) {
    // Create a fragment for all content in the card
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:text '));
    // Append all children of the card (h1, p, button group)
    Array.from(card.childNodes).forEach((node) => {
      frag.appendChild(node);
    });
    contentCell = frag;
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imgCell],
    [contentCell],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}