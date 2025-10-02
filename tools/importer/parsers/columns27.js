/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid (contains heading, quote, and bottom row)
  const mainGrid = element.querySelector('.w-layout-grid.grid-layout');
  if (!mainGrid) return;

  // Extract heading and quote
  const heading = mainGrid.querySelector('.h2-heading');
  const quote = mainGrid.querySelector('.paragraph-lg');

  // Find the inner grid that contains the divider, avatar, and logo
  const innerGrid = mainGrid.querySelector('.w-layout-grid.grid-layout:not(:first-child)') || mainGrid.querySelector('.w-layout-grid.grid-layout');

  // Divider
  const divider = innerGrid.querySelector('.divider');

  // Avatar row (flex-horizontal)
  const avatarRow = innerGrid.querySelector('.flex-horizontal');

  // Logo (utility-display-inline-block)
  const logoCell = innerGrid.querySelector('.utility-display-inline-block');

  // LEFT COLUMN: heading, divider, avatar row
  const leftCol = document.createElement('div');
  if (heading) leftCol.appendChild(heading);
  if (divider) leftCol.appendChild(divider.cloneNode(true));
  if (avatarRow) leftCol.appendChild(avatarRow);

  // RIGHT COLUMN: quote, logo
  const rightCol = document.createElement('div');
  if (quote) rightCol.appendChild(quote);
  if (logoCell) rightCol.appendChild(logoCell);

  // Table rows
  const headerRow = ['Columns (columns27)'];
  const contentRow = [leftCol, rightCol];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}