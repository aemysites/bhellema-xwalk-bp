/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row (must have only one column: block name)
  const headerRow = ['Accordion'];

  // Find all accordion items (each .w-dropdown is one item)
  const items = Array.from(element.querySelectorAll('.w-dropdown'));

  // Build rows for each accordion item
  const rows = items.map((item) => {
    // Title: clickable header (role="button")
    const toggle = item.querySelector('[role="button"]');
    let titleText = '';
    // The actual title is inside .paragraph-lg within the toggle
    const titleEl = toggle ? toggle.querySelector('.paragraph-lg') : null;
    if (titleEl) {
      titleText = titleEl.textContent.trim();
    }

    // Content: rich text inside .accordion-content
    const contentNav = item.querySelector('.accordion-content');
    let contentFrag = null;
    if (contentNav) {
      // Find the rich text element
      const richText = contentNav.querySelector('.rich-text');
      if (richText) {
        // Clone to avoid moving from original DOM
        const clonedRichText = richText.cloneNode(true);
        contentFrag = document.createDocumentFragment();
        contentFrag.appendChild(document.createComment(' field:text '));
        contentFrag.appendChild(clonedRichText);
      }
    }

    // Title cell with field comment
    const titleFrag = document.createDocumentFragment();
    titleFrag.appendChild(document.createComment(' field:summary '));
    titleFrag.appendChild(document.createTextNode(titleText));

    return [titleFrag, contentFrag];
  });

  // Table cells: header + item rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Remove any extra columns from the header row to ensure only one column in the header
  const thead = block.querySelector('thead');
  if (thead && thead.rows.length > 0) {
    const headerCells = thead.rows[0].children;
    while (headerCells.length > 1) {
      headerCells[1].remove();
    }
  }

  // Replace the original element with the block table
  element.replaceWith(block);
}