/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to wrap content with field comment
  function withFieldComment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Get the main grid that contains all cards
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;

  // The first card is the large feature card (first child, an <a>)
  const cards = [];
  const gridChildren = Array.from(grid.children);
  // First card (feature card)
  const featureCard = gridChildren[0];
  if (featureCard && featureCard.tagName === 'A') {
    // Image
    let imageCell = '';
    const imgDiv = featureCard.querySelector('.utility-aspect-2x3');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) {
        // Wrap in <picture> for robustness
        const picture = document.createElement('picture');
        picture.appendChild(img);
        imageCell = withFieldComment('image', picture);
      }
    }
    // Text (heading, paragraph, button)
    let textCell = '';
    const textDiv = featureCard.querySelector('.utility-padding-all-2rem');
    if (textDiv) {
      // Compose fragment: heading, paragraph, button
      const frag = document.createDocumentFragment();
      const heading = textDiv.querySelector('h3');
      if (heading) frag.appendChild(heading);
      const para = textDiv.querySelector('p');
      if (para) frag.appendChild(para);
      const cta = textDiv.querySelector('.button');
      if (cta) frag.appendChild(cta);
      textCell = withFieldComment('text', frag);
    }
    cards.push([imageCell, textCell]);
  }

  // The remaining cards are inside the second grid (second child)
  const subGrid = gridChildren[1];
  if (subGrid && subGrid.classList.contains('w-layout-grid')) {
    const subCards = Array.from(subGrid.querySelectorAll('a.utility-link-content-block'));
    subCards.forEach(card => {
      // Image
      let imageCell = '';
      const imgDiv = card.querySelector('[class*="utility-aspect"]');
      if (imgDiv) {
        const img = imgDiv.querySelector('img');
        if (img) {
          const picture = document.createElement('picture');
          picture.appendChild(img);
          imageCell = withFieldComment('image', picture);
        }
      }
      // Text (heading, paragraph)
      let textCell = '';
      const heading = card.querySelector('h3');
      const para = card.querySelector('p');
      if (heading || para) {
        const frag = document.createDocumentFragment();
        if (heading) frag.appendChild(heading);
        if (para) frag.appendChild(para);
        textCell = withFieldComment('text', frag);
      }
      cards.push([imageCell, textCell]);
    });
  }

  // Build table rows
  const rows = [];
  rows.push(['Cards (cards2)']);
  for (const [imgCell, txtCell] of cards) {
    rows.push([
      imgCell || '',
      txtCell || ''
    ]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}