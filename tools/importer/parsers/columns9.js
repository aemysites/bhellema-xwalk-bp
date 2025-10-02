/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main grid layout container (the two columns)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid
  const gridChildren = Array.from(grid.children);

  // Identify left column (text) and right column (contact info)
  // The first child is the left column (text)
  const leftCol = gridChildren.find((el) => el.tagName === 'DIV');
  // The UL is the right column (contact info)
  const rightCol = gridChildren.find((el) => el.tagName === 'UL');
  // The IMG is the image below the columns
  const img = gridChildren.find((el) => el.tagName === 'IMG');

  // Defensive: if any are missing, abort
  if (!leftCol || !rightCol || !img) return;

  // Build the table rows
  const headerRow = ['Columns (columns9)'];
  const columnsRow = [leftCol, rightCol];
  const imageRow = [img, '']; // image spans first column, second column empty

  // The columns block expects the second row to define the number of columns
  // and all subsequent rows to have the same number of columns
  const tableRows = [
    headerRow,
    columnsRow,
    imageRow,
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}