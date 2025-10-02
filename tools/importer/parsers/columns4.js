/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns4)'];

  // Defensive: get the grid layout container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get immediate children of grid (these are the columns)
  const columns = Array.from(grid.children);

  // Defensive: expect two columns (left: heading+desc, right: buttons)
  // Left column: heading and paragraph
  const leftCol = columns[0];
  // Right column: button group
  const rightCol = columns[1];

  // Compose left column content
  // Use all children of leftCol
  const leftColContent = document.createDocumentFragment();
  Array.from(leftCol.childNodes).forEach((node) => {
    leftColContent.appendChild(node);
  });

  // Compose right column content
  // Use all children of rightCol
  const rightColContent = document.createDocumentFragment();
  Array.from(rightCol.childNodes).forEach((node) => {
    rightColContent.appendChild(node);
  });

  // Second row: two columns, left and right
  const contentRow = [leftColContent, rightColContent];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}