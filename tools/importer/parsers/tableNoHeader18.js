/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child dividers (each represents a row)
  const rows = Array.from(element.querySelectorAll(':scope > div.divider'));
  // Table header row (block name)
  const headerRow = ['Table (no header)'];
  // Prepare table rows
  const tableRows = [headerRow];

  rows.forEach((divider) => {
    // Each divider contains a grid with two children: question and answer
    const grid = divider.querySelector('.w-layout-grid');
    if (!grid) return;
    const cells = Array.from(grid.children);
    if (cells.length < 2) return;
    // Question (left column)
    const question = cells[0];
    // Answer (right column)
    const answer = cells[1];
    // Field comments (no model fields provided, so use generic names)
    // You must ALWAYS add a field comment before content in each cell
    const fragQ = document.createDocumentFragment();
    fragQ.appendChild(document.createComment(' field:question '));
    fragQ.appendChild(question);
    const fragA = document.createDocumentFragment();
    fragA.appendChild(document.createComment(' field:answer '));
    fragA.appendChild(answer);
    tableRows.push([fragQ, fragA]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace original element with the new block
  element.replaceWith(block);
}