/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: No field comments required in cells
  // Find the grid container
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // Build the table rows
  const headerRow = ['Columns (columns21)'];

  // The second row: each column becomes a cell
  // Defensive: Only include columns with content
  const contentRow = columns.map((col) => col);

  // Table: header row, then content row
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}