/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);

  // Compose left column: Name + tags
  const leftColFrag = document.createDocumentFragment();
  if (gridChildren[0]) leftColFrag.appendChild(gridChildren[0]);
  if (gridChildren[1]) leftColFrag.appendChild(gridChildren[1]);

  // Center column: Heading
  const centerColFrag = document.createDocumentFragment();
  if (gridChildren[2]) centerColFrag.appendChild(gridChildren[2]);

  // Right column: Rich text
  const rightColFrag = document.createDocumentFragment();
  if (gridChildren[3]) rightColFrag.appendChild(gridChildren[3]);

  // Build the table rows
  const headerRow = ['Columns (columns31)'];
  const contentRow = [leftColFrag, centerColFrag, rightColFrag];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}