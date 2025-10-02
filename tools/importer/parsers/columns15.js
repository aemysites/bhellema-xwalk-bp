/* global WebImporter */
export default function parse(element, { document }) {
  // Get the direct grid container (skip .container)
  const grid = element.querySelector(':scope > .grid-layout');
  if (!grid) return;

  // Get all direct children of the grid (columns)
  const columns = Array.from(grid.children);

  // Build the table rows
  const headerRow = ['Columns (columns15)'];
  const contentRow = columns.map(col => col);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}