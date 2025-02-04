import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "svg-zoom",
  initialize() {
    withPluginApi("0.8.31", api => {
      function addZoomLinksToSVGs() {
        const svgs = document.querySelectorAll('.cooked svg');
        
        svgs.forEach(svg => {
          if (!svg.nextElementSibling?.classList.contains('svg-zoom-link')) {
            const zoomLink = document.createElement('a');
            zoomLink.href = '#';
            zoomLink.textContent = 'zoom';
            zoomLink.className = 'svg-zoom-link';
            
            svg.insertAdjacentElement('afterend', zoomLink);
          }
        });
      }

      api.onPageChange(() => {
        addZoomLinksToSVGs();
      });

      // Für dynamisch nachgeladene Inhalte
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            addZoomLinksToSVGs();
          }
        });
      });

      api.decorateCooked($elem => {
        observer.observe($elem[0], {
          childList: true,
          subtree: true
        });
      }, { id: 'svg-zoom' });
    });
  }
}; 