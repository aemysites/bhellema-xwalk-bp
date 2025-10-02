/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns8) block parsing
  // Header row: always block name
  const headerRow = ['Columns (columns8)'];

  // Defensive: find the grid container (should be direct child of .container)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid
  const gridChildren = Array.from(grid.children);

  // Left column: heading (h2)
  const leftCol = gridChildren.find((el) => el.tagName === 'H2');
  // Right column: paragraph and button (contained in a div)
  const rightColDiv = gridChildren.find((el) => el.tagName === 'DIV');

  // Defensive: if either column missing, fallback to all children
  let leftContent = leftCol || null;
  let rightContent = null;
  if (rightColDiv) {
    // Get paragraph and button inside rightColDiv
    const rightColChildren = Array.from(rightColDiv.children);
    // Paragraph
    const paragraph = rightColChildren.find((el) => el.tagName === 'P');
    // Button (anchor)
    const button = rightColChildren.find((el) => el.tagName === 'A');
    // Compose right column content
    rightContent = document.createDocumentFragment();
    if (paragraph) rightContent.appendChild(paragraph);
    if (button) rightContent.appendChild(button);
  } else {
    // Fallback: try to find paragraph and button anywhere
    const paragraph = grid.querySelector('p');
    const button = grid.querySelector('a');
    rightContent = document.createDocumentFragment();
    if (paragraph) rightContent.appendChild(paragraph);
    if (button) rightContent.appendChild(button);
  }

  // Build table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}