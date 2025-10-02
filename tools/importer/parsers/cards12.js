/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards12) block: 2 columns, multiple rows, header row with block name
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  // Select all card links (each card is an <a> element)
  const cardLinks = element.querySelectorAll('a.utility-link-content-block');

  cardLinks.forEach((cardLink) => {
    // --- First Column: Image ---
    // Find the image inside the card
    const imageContainer = cardLink.querySelector('.utility-aspect-2x3');
    const img = imageContainer ? imageContainer.querySelector('img') : null;
    let imageCell = document.createDocumentFragment();
    if (img) {
      // Field hint for image
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }
    // If no image, leave cell empty (no comment)

    // --- Second Column: Text ---
    // Find tag, date, and heading
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    // Tag and date
    const meta = cardLink.querySelector('.flex-horizontal');
    if (meta) {
      textFrag.appendChild(meta);
    }
    // Heading
    const heading = cardLink.querySelector('h3, .h4-heading');
    if (heading) {
      textFrag.appendChild(heading);
    }
    // If no text, leave cell empty (no comment)

    // Add row to table
    rows.push([imageCell, textFrag]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}