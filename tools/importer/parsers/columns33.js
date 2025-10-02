/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container (columns)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  // Get the two main columns: image and content
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // Left column: image
  const imageEl = columns.find((el) => el.tagName === 'IMG');
  // Right column: content block (text, tags, heading, byline)
  const contentEl = columns.find((el) => el !== imageEl);

  // Build table rows
  const headerRow = ['Columns (columns33)'];
  const contentRow = [
    imageEl,
    contentEl,
  ];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}