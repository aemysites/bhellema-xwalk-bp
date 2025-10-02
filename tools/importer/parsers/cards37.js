/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a field comment and content
  function fieldFragment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Find the main container for cards
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Prepare header row
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  // --- Card Extraction ---

  // 1. Main Card (left, large)
  const mainCard = grid.querySelector('a.utility-link-content-block');
  if (mainCard) {
    // Image (first child div with img)
    let imageCell = '';
    const imageDiv = mainCard.querySelector('div > img')?.parentElement;
    if (imageDiv) {
      // Use the div containing the image
      imageCell = fieldFragment('image', imageDiv);
    }
    // Text (tag, heading, paragraph)
    let textCell = '';
    const textFrag = document.createDocumentFragment();
    const tag = mainCard.querySelector('.tag-group');
    const heading = mainCard.querySelector('h3');
    const desc = mainCard.querySelector('p');
    if (tag) textFrag.appendChild(tag);
    if (heading) textFrag.appendChild(heading);
    if (desc) textFrag.appendChild(desc);
    if (textFrag.childNodes.length) {
      textCell = fieldFragment('text', textFrag);
    }
    rows.push([imageCell, textCell]);
  }

  // 2. Right Column Cards (image cards)
  // The right column is two flex-horizontal blocks: first with 2 image cards, then a stack of text-only cards
  const flexBlocks = grid.querySelectorAll('.flex-horizontal.flex-vertical.flex-gap-sm');
  if (flexBlocks.length > 0) {
    // First flex block: two image cards
    const imageCards = flexBlocks[0].querySelectorAll('a.utility-link-content-block');
    imageCards.forEach(card => {
      // Image
      let imageCell = '';
      const imageDiv = card.querySelector('div > img')?.parentElement;
      if (imageDiv) {
        imageCell = fieldFragment('image', imageDiv);
      }
      // Text
      let textCell = '';
      const textFrag = document.createDocumentFragment();
      const tag = card.querySelector('.tag-group');
      const heading = card.querySelector('h3');
      const desc = card.querySelector('p');
      if (tag) textFrag.appendChild(tag);
      if (heading) textFrag.appendChild(heading);
      if (desc) textFrag.appendChild(desc);
      if (textFrag.childNodes.length) {
        textCell = fieldFragment('text', textFrag);
      }
      rows.push([imageCell, textCell]);
    });
    // Second flex block: text-only cards separated by dividers
    if (flexBlocks.length > 1) {
      // Each card is an <a.utility-link-content-block>, ignore .divider
      const textCards = flexBlocks[1].querySelectorAll('a.utility-link-content-block');
      textCards.forEach(card => {
        // No image
        let imageCell = '';
        // Text
        let textCell = '';
        const textFrag = document.createDocumentFragment();
        const heading = card.querySelector('h3');
        const desc = card.querySelector('p');
        if (heading) textFrag.appendChild(heading);
        if (desc) textFrag.appendChild(desc);
        if (textFrag.childNodes.length) {
          textCell = fieldFragment('text', textFrag);
        }
        rows.push([imageCell, textCell]);
      });
    }
  }

  // Build the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}