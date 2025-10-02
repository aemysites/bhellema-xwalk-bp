/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a field comment and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Header row
  const headerRow = ['Hero (hero29)'];

  // 2. Background image row
  // Find the first <img> inside the hero section
  let imageEl = element.querySelector('img');
  let imageCell = '';
  if (imageEl) {
    // Wrap image in <picture> for best practice
    const picture = document.createElement('picture');
    picture.appendChild(imageEl);
    imageCell = fieldFragment('image', picture);
  }

  // 3. Text row (headline, subheading, cta)
  // Find the main heading (h1)
  let textCell = '';
  const h1 = element.querySelector('h1');
  if (h1) {
    // Clone the heading to avoid moving it from the DOM
    const heading = h1.cloneNode(true);
    textCell = fieldFragment('text', heading);
  }

  // Create the table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell],
  ];

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}