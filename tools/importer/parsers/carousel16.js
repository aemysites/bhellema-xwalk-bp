/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a cell with a field comment and content
  function fieldCell(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // Get all immediate image containers (each slide)
  const grid = element.querySelector('.grid-layout');
  const slideDivs = grid ? Array.from(grid.children) : [];

  // Carousel header row (2 columns)
  const headerRow = ['Carousel (carousel16)', ''];

  // Build slide rows: always 2 columns per row (image, text)
  const rows = slideDivs.map((slideDiv) => {
    // Find the image element inside the slide
    const img = slideDiv.querySelector('img');
    let imgCell = '';
    if (img) {
      // Wrap image in a <picture> for best practice
      const picture = document.createElement('picture');
      picture.appendChild(img);
      imgCell = fieldCell('media_image', picture);
    }
    // No text content in this layout, so second cell is empty
    return [imgCell, ''];
  });

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}