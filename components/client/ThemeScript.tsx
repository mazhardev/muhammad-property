/**
 * Runs before first paint, and does two things that must happen that early:
 *
 *  1. Restores the saved colour theme, so a returning visitor who chose dark
 *     never sees a white flash.
 *  2. Marks <html class="js">, which is what arms the reveal-on-scroll
 *     animation. Without it the .reveal sections stay plainly visible, so a
 *     script failure degrades to a static page instead of a blank one.
 */
const script = `
(function(){var d=document.documentElement;d.classList.add('js');
try{var t=localStorage.getItem('mp-theme');
if(t==='dark'||t==='light'){d.setAttribute('data-theme',t);}}catch(e){}})();
`.trim();

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
