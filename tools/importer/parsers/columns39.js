/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: NO field comments required in cells
  // Header row must match exactly
  const headerRow = ['Columns (columns39)'];

  // Find the grid layout containing the two main columns
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // Left column: text content (heading, subheading, buttons)
  const leftCol = columns[0];

  // Right column: images (each image gets its own cell)
  const rightCol = columns[1];
  const imageGrid = rightCol.querySelector('.w-layout-grid');
  const images = imageGrid ? Array.from(imageGrid.querySelectorAll('img')) : [];

  // Compose row: left cell (text/buttons), then each image as its own cell
  const row = [leftCol, ...images];

  // Create table with header and content row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  element.replaceWith(table);
}