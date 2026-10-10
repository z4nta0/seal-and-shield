


// #region Imports

import { redMotFun   } from '../utils/motion.ts'; // What: Reduce Motion Function. Why: A section link's smooth scroll has to respect the reduced-motion preference. How: visSecFun asks it before choosing the scroll behavior.
import { useNavigate } from 'react-router';       // What: Use Navigate. Why: A section link on any page but the home page has to take the visitor home first. How: This returns the router's navigate function.

// #endregion Imports



/**
 * section-link.ts = Section Link
 *
 * @summary
 * The one way the bar and the footer reach a home page section, from any
 * page. On the home page the section is already there, so the link scrolls
 * to it in place, smoothly unless the visitor asked for reduced motion. On
 * any other page, such as the 404 page, the section doesn't exist yet, so
 * the link navigates to the home page with the section's id as the hash,
 * and the home page scrolls to it on arrival and then clears the hash, so
 * the address bar stays free of hashes either way.
 *
 * Sections:
 *  - Hooks
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Hooks

// #region useSecLinFun

/**
 * useSecLinFun = Use Section Link Function
 *
 * @summary
 * Returns visSecFun, the function a section link calls with its section's
 * id. When an element with that id is on the page, visSecFun scrolls it into
 * view, jumping instead of gliding under reduced motion. When there isn't
 * one, visSecFun navigates to the home page with the id as the hash, inside
 * the site without a full page load, where HomPagCom scrolls to it.
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

// #endregion Hooks



// #region Exports

export { useSecLinFun }; // What: Named Exports. Why: The bar and the footer both reach sections through it. How: This exports useSecLinFun.

// #endregion Exports


