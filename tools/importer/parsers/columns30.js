/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: no field comments required in cells
  // Get all direct child divs (each column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, find the image inside
  const columnImages = columns.map(col => {
    // Defensive: find the first <img> inside this column
    const img = col.querySelector('img');
    return img ? img : null;
  });

  // Header row (block name)
  const headerRow = ['Columns (columns30)'];

  // Content row: one cell per column, each containing the image
  const contentRow = columnImages;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}