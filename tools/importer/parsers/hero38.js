/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to add field comment before content
  function withFieldComment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Extract content from the source HTML
  const grid = element.querySelector('.grid-layout');
  let heading = null;
  let subheading = null;
  let cta = null;

  if (grid) {
    // Find the first child div: contains heading and subheading
    const contentDiv = grid.querySelector('div');
    if (contentDiv) {
      heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
      subheading = contentDiv.querySelector('p');
    }
    // Find the CTA button (anchor)
    cta = grid.querySelector('a, button');
  }

  // The only model field for content is 'text', so all content goes in one cell with one field comment
  const textFrag = document.createDocumentFragment();
  if (heading) textFrag.appendChild(heading);
  if (subheading) textFrag.appendChild(subheading);
  if (cta) textFrag.appendChild(cta);

  const headerRow = ['Hero (hero38)'];
  // Always add a field comment for the image row, even if empty, per strict field hinting rules
  const imageRow = [withFieldComment('image', document.createTextNode(''))];
  const textRow = textFrag.childNodes.length ? [withFieldComment('text', textFrag)] : [''];

  const rows = [headerRow, imageRow, textRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}