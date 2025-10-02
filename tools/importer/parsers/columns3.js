/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match block name exactly
  const headerRow = ['Columns (columns3)'];

  // Locate the grid layout containing columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const children = Array.from(grid.children);

  // Find the image element
  let imageEl = grid.querySelector('img');

  // Find the content div (the one with the text/buttons)
  let contentDiv = null;
  for (const child of children) {
    if (child.tagName !== 'IMG') {
      contentDiv = child;
      break;
    }
  }

  // Defensive: if not found, fallback
  if (!contentDiv) {
    contentDiv = grid.querySelector('div');
  }

  // For the left column, collect all content (headline, subheading, buttons)
  let leftColContent = null;
  if (contentDiv) {
    leftColContent = document.createElement('div');
    // Append all child nodes (including text, h1, p, buttons)
    Array.from(contentDiv.childNodes).forEach((node) => {
      leftColContent.appendChild(node.cloneNode(true));
    });
  }

  // Build the columns row: [left content, right image]
  const columnsRow = [
    leftColContent,
    imageEl
  ];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}