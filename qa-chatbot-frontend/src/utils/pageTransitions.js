// utils/pageTransitions.js
// Add this utility file to handle smooth page transitions

export class PageTransition {
    static isTransitioning = false;
    static transitionDuration = 300;
  
    static createOverlay() {
      const overlay = document.createElement('div');
      overlay.id = 'page-transition-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
        z-index: 9999;
        opacity: 0;
        transition: opacity ${this.transitionDuration}ms ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
      `;
      
      const spinner = document.createElement('div');
      spinner.innerHTML = `
        <div style="
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          font-weight: 500;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="
            width: 24px;
            height: 24px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: pageTransitionSpin 1s linear infinite;
          "></div>
          <span>Loading...</span>
        </div>
      `;
      
      // Add keyframe animation if it doesn't exist
      if (!document.getElementById('page-transition-styles')) {
        const style = document.createElement('style');
        style.id = 'page-transition-styles';
        style.textContent = `
          @keyframes pageTransitionSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
      
      overlay.appendChild(spinner);
      return overlay;
    }
  
    static async navigate(url, options = {}) {
      if (this.isTransitioning) return;
      
      // Don't navigate if already on the page
      if (window.location.pathname === url) return;
      
      this.isTransitioning = true;
      
      const {
        onStart = () => {},
        onComplete = () => {},
        duration = this.transitionDuration
      } = options;
      
      onStart();
      
      // Create and show overlay
      const overlay = this.createOverlay();
      document.body.appendChild(overlay);
      
      // Trigger fade in
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });
      
      // Add navigation class to body
      document.body.classList.add('navigation-loading');
      
      // Navigate after transition
      setTimeout(() => {
        onComplete();
        window.location.href = url;
      }, duration);
    }
  
    static removeOverlay() {
      const overlay = document.getElementById('page-transition-overlay');
      if (overlay) {
        overlay.remove();
      }
      document.body.classList.remove('navigation-loading');
      this.isTransitioning = false;
    }
  
    static initializePageLoad() {
      // Handle page load animations
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('page-loaded');
        
        // Remove any existing overlay
        this.removeOverlay();
        
        // Staggered animations for elements
        const staggerElements = document.querySelectorAll('.stagger-animation');
        staggerElements.forEach((el, index) => {
          el.style.animationDelay = `${index * 0.1}s`;
        });
      });
    }
  
    static handleLinkClicks() {
      // Intercept all internal navigation links
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="/"]');
        if (link && !link.hasAttribute('data-no-transition')) {
          e.preventDefault();
          this.navigate(link.href);
        }
      });
    }
  }
  
  // Smooth navigation hook for React components
  export const useSmoothNavigation = () => {
    const navigate = (path, options = {}) => {
      return PageTransition.navigate(path, options);
    };
  
    return { navigate };
  };
  
  // Initialize on load
  if (typeof window !== 'undefined') {
    PageTransition.initializePageLoad();
    PageTransition.handleLinkClicks();
  }
  
  // Export for direct use
  export default PageTransition;