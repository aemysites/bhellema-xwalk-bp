/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name for the header row
  const headerRow = ['Columns (columns28)'];

  // Defensive: Find the grid layout (columns)
  const grid = element.querySelector('.grid-layout');
  let leftCellContent = [];
  let rightCellContent = [];

  if (grid) {
    // Get direct children of the grid (should be two: left content, right image)
    const columns = grid.querySelectorAll(':scope > *');
    if (columns.length === 2) {
      // Left column: text content
      const left = columns[0];
      // Get all children in order
      leftCellContent = Array.from(left.childNodes);
      // Right column: image
      const right = columns[1];
      // Defensive: If it's an image, use it; otherwise, look for image inside
      let img = right;
      if (!(img instanceof HTMLImageElement)) {
        img = right.querySelector('img');
      }
      if (img) {
        rightCellContent = [img];
      }
    }
  }

  // Fallback: If grid not found, try to get main children
  if (!leftCellContent.length || !rightCellContent.length) {
    const mainDivs = element.querySelectorAll(':scope > div');
    if (mainDivs.length) {
      // Try to find the grid inside these divs
      for (const div of mainDivs) {
        const grid = div.querySelector('.grid-layout');
        if (grid) {
          const columns = grid.querySelectorAll(':scope > *');
          if (columns.length === 2) {
            leftCellContent = Array.from(columns[0].childNodes);
            let img = columns[1];
            if (!(img instanceof HTMLImageElement)) {
              img = columns[1].querySelector('img');
            }
            if (img) {
              rightCellContent = [img];
            }
            break;
          }
        }
      }
    }
  }

  // Compose the table rows
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}