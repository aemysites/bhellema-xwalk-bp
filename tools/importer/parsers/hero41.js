/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with field comment and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Header row
  const headerRow = ['Hero (hero41)'];

  // 2. Image row (background image)
  // Find the first <img> in the hero section
  const img = element.querySelector('img');
  let imageCell = '';
  if (img) {
    // Wrap in <picture> for best practices
    const picture = document.createElement('picture');
    picture.appendChild(img);
    imageCell = fieldFragment('image', picture);
  }

  // 3. Text row (headline, subheading, CTA)
  // Find the main heading, paragraph, and CTA link
  let textCell = '';
  const textFrag = document.createDocumentFragment();
  // Main heading
  const h1 = element.querySelector('h1');
  if (h1) textFrag.appendChild(h1);
  // Subheading/paragraph
  const p = element.querySelector('p');
  if (p) textFrag.appendChild(p);
  // CTA button (anchor)
  const cta = element.querySelector('a');
  if (cta) textFrag.appendChild(cta);
  if (textFrag.childNodes.length > 0) {
    textCell = fieldFragment('text', textFrag);
  }

  // Compose the table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell],
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}