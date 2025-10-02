/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a field comment + content fragment
  function withFieldComment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Get all direct children (each card is a direct child div)
  const cardDivs = Array.from(element.children);

  // Prepare table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Cards (cards26)']);

  // For each card, extract image and text content
  cardDivs.forEach((cardDiv) => {
    // Find the image (first img descendant)
    const img = cardDiv.querySelector('img');
    let imageCell = '';
    if (img) {
      // Wrap in <picture> for robustness
      const picture = document.createElement('picture');
      picture.appendChild(img);
      imageCell = withFieldComment('image', picture);
    }

    // Find the text block (look for h3/h2/h4 + p inside)
    let textCell = '';
    // Look for a div with padding (contains text)
    const textWrapper = cardDiv.querySelector('.utility-padding-all-2rem');
    if (textWrapper) {
      // Clone to avoid moving original nodes
      const frag = document.createDocumentFragment();
      Array.from(textWrapper.children).forEach((child) => {
        frag.appendChild(child);
      });
      textCell = withFieldComment('text', frag);
    }
    // If no text wrapper, check for a heading or paragraph directly
    if (!textCell) {
      const heading = cardDiv.querySelector('h1, h2, h3, h4, h5, h6');
      const para = cardDiv.querySelector('p');
      if (heading || para) {
        const frag = document.createDocumentFragment();
        if (heading) frag.appendChild(heading);
        if (para) frag.appendChild(para);
        textCell = withFieldComment('text', frag);
      }
    }
    // If neither, leave cell empty

    // Always 2 columns: [image, text]
    rows.push([
      imageCell || '',
      textCell || '',
    ]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}