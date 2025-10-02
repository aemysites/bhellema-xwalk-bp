/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Carousel (carousel24)'];

  // Defensive: Find the card body (contains heading and image)
  const cardBody = element.querySelector('.card-body');
  if (!cardBody) return;

  // Extract image (mandatory)
  const img = cardBody.querySelector('img');

  // Extract heading (optional)
  const heading = cardBody.querySelector('.h4-heading');

  // Build image cell with field comment
  let imageCell = null;
  if (img) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:media_image '));
    frag.appendChild(img);
    imageCell = frag;
  }

  // Build text cell with field comment (if heading exists)
  let textCell = null;
  if (heading) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:content_text '));
    frag.appendChild(heading);
    textCell = frag;
  }

  // Compose slide row: always two columns (image, text)
  const slideRow = [imageCell, textCell];

  // Build table rows
  const rows = [headerRow, slideRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with block table
  element.replaceWith(block);
}