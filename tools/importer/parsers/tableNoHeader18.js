/* global WebImporter */
export default function parse(element, { document }) {
  // Table (no header) block: 2 columns, 4 rows
  // Get all divider blocks (each is a row)
  const rows = Array.from(element.querySelectorAll(':scope > .divider'));
  // Each divider contains a grid with two children: question and answer
  const dataRows = rows.map(divider => {
    const grid = divider.querySelector('.w-layout-grid');
    if (!grid) return null;
    const children = Array.from(grid.children);
    // Defensive: expect [question, answer]
    if (children.length < 2) return null;
    // Extract full text content from each cell (not elements)
    const questionText = children[0].textContent.trim();
    const answerText = children[1].textContent.trim();
    return [questionText, answerText];
  }).filter(Boolean);

  // Table header row (block name)
  const headerRow = ['Table (no header)'];
  // Second row: table-2-columns
  const variantRow = ['table-2-columns'];
  // Data rows: each starts with 'table-col-2', then the two cells
  const tableRows = dataRows.map(([question, answer]) => {
    return ['table-col-2', question, answer];
  });

  // Compose table data
  const cells = [
    headerRow,
    variantRow,
    ...tableRows
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}