/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a field comment and content
  function fieldFrag(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Get tab menu (tab labels)
  const tabMenu = element.querySelector('.w-tab-menu');
  const tabLinks = tabMenu ? Array.from(tabMenu.querySelectorAll('.w-tab-link')) : [];

  // Get tab content panels
  const tabContent = element.querySelector('.w-tab-content');
  const tabPanes = tabContent ? Array.from(tabContent.querySelectorAll('.w-tab-pane')) : [];

  // Table header row (block name)
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // For each tab, create a row [Tab Label, Tab Content]
  tabLinks.forEach((tabLink, idx) => {
    // Tab label (text only)
    const labelDiv = tabLink.querySelector('div');
    const tabLabel = labelDiv ? labelDiv.textContent.trim() : tabLink.textContent.trim();
    const tabLabelNode = document.createTextNode(tabLabel);
    const tabLabelCell = fieldFrag('title', tabLabelNode);

    // Tab content panel
    const tabPane = tabPanes[idx];
    let tabContentCell;
    if (tabPane) {
      // Instead of picking heading/image separately, include all grid children
      const grid = tabPane.querySelector('.w-layout-grid');
      let contentFrag = document.createDocumentFragment();
      if (grid) {
        Array.from(grid.childNodes).forEach(node => {
          // Only include element nodes and text nodes with non-whitespace
          if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
            contentFrag.appendChild(node.cloneNode(true));
          }
        });
      }
      tabContentCell = contentFrag;
    } else {
      tabContentCell = document.createDocumentFragment();
    }
    rows.push([tabLabelCell, tabContentCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}