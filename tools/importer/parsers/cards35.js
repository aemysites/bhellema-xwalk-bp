/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards35) block: 2 columns, multiple rows, each row = card (image, text)
  // Model fields: image, text

  // Header row: must have two columns to match data rows
  const headerRow = ['Cards (cards35)', ''];

  // Get all card containers (each direct child div is a card)
  const cardDivs = Array.from(element.children);

  // Build table rows
  const rows = cardDivs.map((cardDiv) => {
    // Find image inside cardDiv
    const img = cardDiv.querySelector('img');
    let imageCell = '';
    if (img) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:image '));
      frag.appendChild(img);
      imageCell = frag;
    }
    // Always include a field comment for the text cell, even if empty
    let textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    // No text content, so leave cell empty after comment
    return [imageCell, textCell];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element with block
  element.replaceWith(block);
}