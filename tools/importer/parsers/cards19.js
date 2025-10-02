/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards19) block: 2 columns, multiple rows, header row first
  const headerRow = ['Cards (cards19)'];

  // Find all card containers (each direct child of the grid)
  const cardDivs = Array.from(element.children);

  // Build rows for each card
  const rows = cardDivs.map((cardDiv) => {
    // Find the icon/image (first .icon img in cardDiv)
    let img = cardDiv.querySelector('.icon img');
    let imageCell = document.createElement('div');
    if (img) {
      // Wrap image in a fragment with field comment
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:image '));
      frag.appendChild(img);
      imageCell.appendChild(frag);
    }
    // If no image, leave cell empty (no comment)

    // Find the text (first <p> in cardDiv)
    let text = cardDiv.querySelector('p');
    let textCell = document.createElement('div');
    if (text) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:text '));
      frag.appendChild(text);
      textCell.appendChild(frag);
    }
    // If no text, leave cell empty (no comment)

    return [imageCell.childNodes.length ? imageCell : '', textCell.childNodes.length ? textCell : ''];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}