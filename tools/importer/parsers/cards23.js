/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards23) block: 2 columns, multiple rows
  // Each card: image (field:image) | text (field:text)
  const headerRow = ['Cards (cards23)'];
  const cells = [headerRow];

  // Find all tab panes (each tab contains a grid of cards)
  const tabPanes = element.querySelectorAll('.w-tab-pane');
  tabPanes.forEach((tabPane) => {
    // For each grid in the tab pane
    const grids = tabPane.querySelectorAll('.w-layout-grid');
    grids.forEach((grid) => {
      // Each card is an <a> inside the grid
      const cards = grid.querySelectorAll('a.utility-link-content-block, a.card-link');
      cards.forEach((card) => {
        // --- IMAGE CELL ---
        let imageCell = null;
        // Look for image inside the card
        const img = card.querySelector('img');
        if (img) {
          // Wrap image in <picture>
          const picture = document.createElement('picture');
          picture.appendChild(img);
          // Add field comment for image
          const frag = document.createDocumentFragment();
          frag.appendChild(document.createComment(' field:image '));
          frag.appendChild(picture);
          imageCell = frag;
        } else {
          // No image, empty cell
          imageCell = '';
        }

        // --- TEXT CELL ---
        let textCell = null;
        // Find heading and description
        const heading = card.querySelector('h3');
        const desc = card.querySelector('.paragraph-sm');
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(' field:text '));
        if (heading) frag.appendChild(heading);
        if (desc) frag.appendChild(desc);
        textCell = frag;

        // Add row: [imageCell, textCell]
        cells.push([imageCell, textCell]);
      });
    });
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}