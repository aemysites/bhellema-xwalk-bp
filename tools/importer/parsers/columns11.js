/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top grid (headline/text/author/button)
  const grids = element.querySelectorAll('.w-layout-grid');
  let topGrid = null;
  let bottomGrid = null;
  grids.forEach((grid) => {
    if (grid.classList.contains('tablet-1-column')) {
      topGrid = grid;
    } else if (grid.classList.contains('mobile-portrait-1-column')) {
      bottomGrid = grid;
    }
  });

  // --- Top row: headline/eyebrow (left), paragraph/author/button (right) ---
  let leftColContent = [];
  let rightColContent = [];
  if (topGrid) {
    const leftCol = topGrid.children[0];
    if (leftCol) leftColContent.push(leftCol);
    const rightCol = topGrid.children[1];
    if (rightCol) rightColContent.push(rightCol);
  }

  // --- Bottom row: two images ---
  let leftImg = null;
  let rightImg = null;
  if (bottomGrid) {
    const imgDivs = bottomGrid.querySelectorAll(':scope > div');
    if (imgDivs.length > 0) {
      leftImg = imgDivs[0].querySelector('img');
    }
    if (imgDivs.length > 1) {
      rightImg = imgDivs[1].querySelector('img');
    }
  }

  // Compose left column: headline/eyebrow + left image
  const leftColumn = [];
  if (leftColContent.length) leftColumn.push(leftColContent[0]);
  if (leftImg) leftColumn.push(leftImg);

  // Compose right column: paragraph/author/button + right image
  const rightColumn = [];
  if (rightColContent.length) rightColumn.push(rightColContent[0]);
  if (rightImg) rightColumn.push(rightImg);

  // Table header
  const headerRow = ['Columns (columns11)'];
  // Table content row
  const contentRow = [leftColumn, rightColumn];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace element with table
  element.replaceWith(table);
}