/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns40) block: 3 images side by side
  // CRITICAL: Header row must match block name exactly
  const headerRow = ['Columns (columns40)'];

  // Get all immediate children (each column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, extract its image element (reference, do not clone)
  const images = columns.map(col => col.querySelector('img')).map(img => img || '');

  // Build the table: header row, then a row with each image in a column
  const cells = [
    headerRow,
    images
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}