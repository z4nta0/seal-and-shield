


// #region Imports

import { redMotFun   } from '../utils/motion.ts'; // What: Reduce Motion Function. Why: A section link's smooth scroll has to respect the reduced-motion preference. How: visSecFun asks it before choosing the scroll behavior.
import { useNavigate } from 'react-router';       // What: Use Navigate. Why: A section link on any page but the home page has to take the visitor home first. How: This returns the router's navigate function.

// #endregion Imports



/**
 * section-link.ts = Section Link
 *
 * @summary
 * The one way the bar, the menu, the hero, the footer, and the 404 page reach
 * a home page section, from any page. On the home page the section is already
 * there, so the link scrolls to it in place, smoothly unless the visitor asked
 * for reduced motion. On any other page, such as the 404 page, the section
 * doesn't exist yet, so the link navigates to the home page with the section's
 * id as the hash, and the home page scrolls to it on arrival and then clears
 * the hash, so the address bar stays free of hashes either way. Each link
 * keeps its real address (/#about), so a Ctrl, Cmd, Shift, or Alt click is
 * left to the browser, and a middle click, which the browser sends as
 * auxclick, never reaches the click handler at all; either way the browser
 * opens the home page at that section. Copied from hair-designs' own, which
 * adds secCliFun so every section link shares one click handler.
 *
 * Sections:
 *  - Helpers
 *  - Hooks
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

// #region modCliFun

/**
 * modCliFun = Modified Click Function
 *
 * @summary
 * Whether a click on a section link should be left to the browser: one made
 * with a modifier key held (Ctrl or Cmd to open a new tab, Shift for a new
 * window, Alt to download) or with any button but the main one. A middle
 * click never arrives here in practice, since Chromium, Firefox, and WebKit
 * send it as auxclick rather than click, so the button check is only a
 * safeguard for an engine that does. A section link's handler returns early
 * when this is true, so the link's own address opens the home page at the
 * section, where the home page scrolls to it.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param cliEveObj - Click Event Object: The section link's click event.
 *
 * @returns Whether the browser should handle the click itself.
 * @see {@link modCliBoo}
 *
 * @example
 * ```ts
 * modCliFun(cliEveObj) // => false for a plain click
 * ```
 *
*/

function modCliFun ( cliEveObj : React.MouseEvent< HTMLAnchorElement > ) : boolean {


	const altKeyBoo = cliEveObj.altKey;       // What: Alt Key Boolean. Why: Alt-click downloads the link in some browsers. How: This reads whether Alt was held.
	const conKeyBoo = cliEveObj.ctrlKey;      // What: Control Key Boolean. Why: Ctrl-click opens a new tab elsewhere. How: This reads whether Ctrl was held.
	const metKeyBoo = cliEveObj.metaKey;      // What: Meta Key Boolean. Why: Cmd-click opens a new tab on a Mac. How: This reads whether Cmd was held.
	const othButBoo = cliEveObj.button !== 0; // What: Other Button Boolean. Why: Chromium, Firefox, and WebKit send a middle click as auxclick, so it never reaches this check, but an engine that sent it as a click should still leave it to the browser. How: This checks the click wasn't made with the main button, as a safeguard.
	const shiKeyBoo = cliEveObj.shiftKey;     // What: Shift Key Boolean. Why: Shift-click opens a new window. How: This reads whether Shift was held.

	const modCliBoo = metKeyBoo || conKeyBoo || shiKeyBoo || altKeyBoo || othButBoo; // What: Modified Click Boolean. Why: Any one of these means the visitor asked the browser to open the link its own way. How: This combines them.



	return modCliBoo; // What: Modified Click Return. Why: The link's handler decides from this whether to step aside. How: This hands back the combined answer.


}

// #endregion modCliFun

// #endregion Helpers



// #region Hooks

// #region useSecLinFun

/**
 * useSecLinFun = Use Section Link Function
 *
 * @summary
 * Returns visSecFun, the function a section link calls with its section's id.
 * When an element with that id is on the page, visSecFun scrolls it into view,
 * jumping instead of gliding under reduced motion. When there isn't one,
 * visSecFun navigates to the home page with the id as the hash, inside the
 * site without a full page load, where the home page scrolls to it.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The function a section link calls with its section's id.
 *
 * @example
 * ```ts
 * useSecLinFun() // => visSecFun, the function a section link calls with an id
 * ```
 *
*/

function useSecLinFun () : ( secIdeStr : string ) => void {


	const navRouFun = useNavigate(); // What: Navigate Router Function. Why: A link on another page has to go to the home page. How: This is the router's navigate function.



	return ( secIdeStr : string ) => { // What: Visit Section Function. Why: Every section link shares one way to reach its section. How: This scrolls to the section if it's on the page, or navigates home with its id as the hash.


		const secCurEle = document.getElementById( secIdeStr ); // What: Section Current Element. Why: The section only exists on the home page. How: This looks it up by its id.


		if ( secCurEle ) { secCurEle.scrollIntoView( { behavior : redMotFun() ? 'auto' : 'smooth' } ); return; } // What: In-Page Scroll Guard. Why: On the home page the section is already there. How: This scrolls it into view, jumping instead of gliding under reduced motion, and stops.



		void navRouFun( { hash : secIdeStr, pathname : '/' } ); // What: Home Navigation Call. Why: On any other page the section has to be loaded first. How: This navigates to the home page with the section's id as the hash, and the home page scrolls to it on arrival; void marks the returned promise as deliberately unawaited.


	};


}

// #endregion useSecLinFun



// #region useSecCliFun

/**
 * useSecCliFun = Use Section Click Function
 *
 * @summary
 * Returns secCliFun, the click handler every section link shares. A Ctrl,
 * Cmd, Shift, or Alt click is left to the browser, which opens the link's
 * own address, and a middle click, which the browser sends as auxclick,
 * never reaches it. Any other click stops the browser's jump to the hash
 * and hands the section's id to visSecFun, which scrolls to it on the home
 * page or navigates home to it from any other page. It reports whether it
 * handled the click, so a caller such as the phone menu can close itself
 * only then.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The click handler, which takes the click event and the section's
 *          id and returns whether it handled the click.
 *
 * @example
 * ```ts
 * useSecCliFun() // => secCliFun, called as secCliFun(cliEveObj, 'about')
 * ```
 *
*/

function useSecCliFun () : ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => boolean {


	const visSecFun = useSecLinFun(); // What: Visit Section Function. Why: A plain click reaches its section through the shared path. How: This scrolls to the section on the home page, or navigates home to it.



	return ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Section Click Function. Why: Every section link handles a click the same way. How: This leaves a modified click to the browser and otherwise cancels the jump and visits the section.


		if ( modCliFun( cliEveObj ) ) return false; // What: Modified Click Guard. Why: A Ctrl, Cmd, Shift, or Alt click asks the browser to open the link its own way, and so would a middle click in an engine that sent it as a click rather than auxclick. How: This leaves the click alone and reports it unhandled.



		cliEveObj.preventDefault(); // What: Default Navigation Cancel. Why: The browser would otherwise jump and leave the hash in the address. How: This stops the link's own navigation.

		visSecFun( secIdeStr ); // What: Section Visit Call. Why: The visitor should land on the section they chose. How: This scrolls to it, or navigates home to it from another page.



		return true; // What: Handled Click Return. Why: The caller may want to react, such as by closing the menu. How: This reports the click handled.


	};


}

// #endregion useSecCliFun

// #endregion Hooks



// #region Exports

export { modCliFun, useSecCliFun, useSecLinFun }; // What: Named Exports. Why: The bar, the menu, the hero, the footer, and the 404 page reach sections through these. How: This exports the modified-click check, the shared click handler, and useSecLinFun.

// #endregion Exports


