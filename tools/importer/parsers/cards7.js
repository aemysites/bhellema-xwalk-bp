/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to wrap content with field comment
  function withFieldComment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Get all card containers (each card is a direct child div)
  const cardDivs = Array.from(element.children);

  // Build table rows
  const rows = [];
  // Header row: must be a single column
  rows.push(['Cards (cards7)']);

  // Each card: image in first cell (with field comment), empty second cell
  cardDivs.forEach((cardDiv) => {
    // Find the image in the card
    const img = cardDiv.querySelector('img');
    let imgCell = '';
    if (img) {
      // Wrap image in picture for best practice
      const picture = document.createElement('picture');
      picture.appendChild(img);
      imgCell = withFieldComment('image', picture);
    }
    // Second cell is empty (no text)
    rows.push([imgCell, '']);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}