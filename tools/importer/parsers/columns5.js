/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: no field comments required in cells
  // Get the immediate children of the main grid
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;
  // Find the two main columns: left (content), right (image)
  const columns = Array.from(grid.children);
  // Defensive: Identify left content column and right image column
  let leftContent = null;
  let rightImage = null;
  columns.forEach((col) => {
    if (col.querySelector('h2, .h2-heading')) {
      leftContent = col;
    } else if (col.querySelector('img')) {
      rightImage = col.querySelector('img');
    } else if (col.tagName === 'IMG') {
      rightImage = col;
    }
  });
  // If leftContent is a grid, get its first child (the actual content)
  if (leftContent && leftContent.classList.contains('w-layout-grid')) {
    // Defensive: find the child with h2
    const subCol = Array.from(leftContent.children).find((c) => c.querySelector('h2, .h2-heading'));
    if (subCol) leftContent = subCol;
  }
  // Compose left column cell: heading, paragraph, buttons
  const leftCellContent = [];
  if (leftContent) {
    const heading = leftContent.querySelector('h2, .h2-heading');
    if (heading) leftCellContent.push(heading);
    const desc = leftContent.querySelector('.rich-text, .paragraph-lg, p');
    if (desc) leftCellContent.push(desc);
    const btnGroup = leftContent.querySelector('.button-group');
    if (btnGroup) leftCellContent.push(btnGroup);
  }
  // Compose table rows
  const headerRow = ['Columns (columns5)'];
  const contentRow = [leftCellContent, rightImage ? [rightImage] : []];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}