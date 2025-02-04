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
            
            zoomLink.addEventListener('click', function(e) {
              e.preventDefault();
              
              const svgClone = svg.cloneNode(true);
              
              const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>SVG Zoom View</title>
                    <style>
                        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                        svg { max-width: 95vw; max-height: 95vh; }
                    </style>
                </head>
                <body>
                    ${svgClone.outerHTML}
                </body>
                </html>
              `;
              
              const blob = new Blob([html], { type: 'text/html' });
              const blobUrl = URL.createObjectURL(blob);
              
              window.open(blobUrl, '_blank', 'width=800,height=600');
              
              setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            });
            
            svg.insertAdjacentElement('afterend', zoomLink);
          }
        });
      }

      api.onPageChange(() => {
        addZoomLinksToSVGs();
      });

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