/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: no field comments required in cells
  // Get all immediate children (each column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Each column may contain an image or other content
  const cells = [];
  // Header row (block name)
  cells.push(['Columns (columns1)']);

  // Second row: one cell per column
  const row = columns.map(col => {
    // If column contains only one child, use it directly
    if (col.children.length === 1) {
      return col.firstElementChild;
    }
    // If column contains multiple children, return them as array
    return Array.from(col.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
  });
  cells.push(row);

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}