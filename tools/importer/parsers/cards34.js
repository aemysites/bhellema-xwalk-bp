/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards34) block: 2 columns, multiple rows, header row first
  const headerRow = ['Cards (cards34)'];
  const rows = [];

  // Select all card anchors (each card is an <a> inside the grid)
  const cardLinks = element.querySelectorAll('a.utility-link-content-block');

  cardLinks.forEach((cardLink) => {
    // Find the image (first img in the card)
    const img = cardLink.querySelector('img');
    let imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Find the text content container (the div after the image)
    // It contains tag, read time, heading, paragraph, and CTA
    const contentDivs = cardLink.querySelectorAll('div');
    let textContentDiv = null;
    // The first div is usually the grid, the second is the text content
    if (contentDivs.length > 1) {
      textContentDiv = contentDivs[1];
    }
    let textCell = document.createDocumentFragment();
    if (textContentDiv) {
      textCell.appendChild(document.createComment(' field:text '));
      textCell.appendChild(textContentDiv);
    }

    // Push row: [imageCell, textCell]
    rows.push([imageCell, textCell]);
  });

  // Build table data: header + card rows
  const tableData = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(blockTable);
}