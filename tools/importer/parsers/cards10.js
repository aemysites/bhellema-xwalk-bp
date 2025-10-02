/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards10)'];
  const cells = [headerRow];

  // Select all card links (each card is an <a> element)
  const cardLinks = element.querySelectorAll('a.card-link');

  cardLinks.forEach((cardLink) => {
    // IMAGE CELL
    // Find the image inside the card
    const imageContainer = cardLink.querySelector('.utility-aspect-3x2');
    const img = imageContainer ? imageContainer.querySelector('img') : null;
    let imageCell = '';
    if (img) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:image '));
      frag.appendChild(img);
      imageCell = frag;
    }

    // TEXT CELL
    // Find the text container
    const textContainer = cardLink.querySelector('.utility-padding-all-1rem');
    let textCell = '';
    if (textContainer) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(' field:text '));
      frag.appendChild(textContainer);
      textCell = frag;
    }

    cells.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}