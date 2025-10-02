/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout (columns container)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get the two columns (left: text, right: image)
  const cols = Array.from(grid.children);
  if (cols.length < 2) return;
  const leftCol = cols[0];
  const rightCol = cols[1];

  // Find the main image in the right column
  const mainImg = rightCol.querySelector('img');

  // Build the table rows
  const headerRow = ['Columns (columns32)'];
  // Second row: leftCol content, rightCol image (if present)
  const secondRow = [leftCol, mainImg ? mainImg : ''];

  // Create the columns table (no field comments for columns block)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  element.replaceWith(table);
}