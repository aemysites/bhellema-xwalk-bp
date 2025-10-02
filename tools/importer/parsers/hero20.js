/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to add field comment before content
  function withFieldComment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Table header row
  const headerRow = ['Hero (hero20)'];

  // 2. Background image row (image collage)
  // Find the collage container
  const collageContainer = element.querySelector('.grid-layout.desktop-3-column.utility-min-height-100dvh');
  // Collect all images in the collage
  const collageImages = collageContainer ? Array.from(collageContainer.querySelectorAll('img')) : [];
  // Wrap all images in a div for background asset
  const collageDiv = document.createElement('div');
  collageImages.forEach(img => collageDiv.appendChild(img));
  // Add overlay if present
  const overlay = element.querySelector('.ix-hero-scale-3x-to-1x-overlay.overlay');
  if (overlay) collageDiv.appendChild(overlay);
  // Field: image
  const imageCell = withFieldComment('image', collageDiv);

  // 3. Text content row
  // Find the hero content container
  const contentContainer = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  const textFrag = document.createDocumentFragment();
  // Headline
  const headline = contentContainer ? contentContainer.querySelector('h1') : null;
  if (headline) textFrag.appendChild(headline);
  // Subheading
  const subheading = contentContainer ? contentContainer.querySelector('p') : null;
  if (subheading) textFrag.appendChild(subheading);
  // CTA buttons
  const buttonGroup = contentContainer ? contentContainer.querySelector('.button-group') : null;
  if (buttonGroup) textFrag.appendChild(buttonGroup);
  // Field: text
  const textCell = withFieldComment('text', textFrag);

  // Assemble table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}