/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to wrap content with field comment
  function withFieldComment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Get all immediate children (each card)
  const cardDivs = Array.from(element.children);

  // Build table rows
  const rows = [];
  // Header row as required: exactly one column
  rows.push(['Cards (cards36)']);

  // For each card
  cardDivs.forEach((cardDiv) => {
    // Find the image (if any)
    const img = cardDiv.querySelector('img');
    let imageCell = '';
    if (img) {
      // Wrap img in <picture> for best practice
      const picture = document.createElement('picture');
      picture.appendChild(img);
      imageCell = withFieldComment('image', picture);
    }
    // No text content in these cards
    rows.push([imageCell, '']);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}