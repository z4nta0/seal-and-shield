


// #region Imports

import { AboSecCom   } from './about.tsx';         // What: About Section Component. Why: The page tells the company's story third. How: This is rendered inside main, after the services.
import { ConSecCom   } from './contact.tsx';       // What: Contact Section Component. Why: The page ends where visitors reach the company. How: This is rendered last inside main.
import { HerSecCom   } from './hero.tsx';          // What: Hero Section Component. Why: The page opens with the headline and pitch. How: This is rendered first inside main.
import { NavBarCom   } from '../../ui/nav.tsx';    // What: Navigation Bar Component. Why: Every page starts with the shared top bar. How: This is rendered above main.
import { SerSecCom   } from './services.tsx';      // What: Services Section Component. Why: The page lists what the company does second. How: This is rendered inside main, after the hero.
import { SitFooCom   } from '../../ui/footer.tsx'; // What: Site Footer Component. Why: Every page ends with the shared footer. How: This is rendered below main.
import { useEffect   } from 'react';               // What: Use Effect. Why: Arriving with a section's hash has to scroll there once the sections render. How: This runs the arrival scroll after each render the hash changes.
import { useLocation } from 'react-router';        // What: Use Location. Why: The page needs the hash a section link arrived with. How: This reads the current location.
import { useNavigate } from 'react-router';        // What: Use Navigate. Why: The hash should leave the address once the page has scrolled to it. How: This returns the router's navigate function.

// #endregion Imports



/**
 * home.tsx = Home Page
 *
 * @summary
 * The site's home page: the shared top bar, then the four sections in
 * reading order (the hero, services, about, and contact) inside the main
 * landmark, then the shared footer. It's the page the root path shows, and
 * the one the bar's and footer's section links come back to from any other
 * page, arriving with the section's id as the hash.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region HomPagCom

/**
 * HomPagCom = Home Page Component
 *
 * @summary
 * Renders the whole home page: NavBarCom, a main element holding the hero,
 * services, about, and contact sections in the order a visitor reads them,
 * and SitFooCom. Each section's id is the target of the bar's and footer's
 * section links. When the page arrives with a hash, from a section link on
 * another page or an address like /#contact, it jumps straight to that
 * section once it has rendered and then replaces the address with one
 * without the hash, so the address bar stays as clean as it does when the
 * links scroll in place.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The home page's bar, main content, and footer.
 *
 * @example
 * ```tsx
 * HomPagCom() // => <HomPagCom />
 * ```
 *
*/

function HomPagCom () : React.JSX.Element {


	const { hash : hasValStr } = useLocation(); // What: Hash Value String. Why: A section link from another page arrives with its section's id as the hash. How: This reads the hash, e.g. #contact, or an empty string.

	const navRouFun = useNavigate(); // What: Navigate Router Function. Why: The hash should be cleared once the page has used it. How: This is the router's navigate function.


	useEffect( () => { // What: Hash Arrival Effect. Why: A visitor arriving from a section link should land on that section, with no hash left in the address. How: This jumps to the section the hash names, then replaces the address with one without it.


		if ( !hasValStr ) return; // What: No Hash Guard. Why: Most visits arrive without a hash. How: This does nothing when the hash is empty, including right after it's been cleared.



		document.getElementById( hasValStr.slice( 1 ) )?.scrollIntoView( { behavior : 'instant' } ); // What: Arrival Scroll Call. Why: The visitor should land on the section, as a normal link arrival would. How: This jumps to the element the hash names, without the html element's smooth scrolling, since gliding down from the top of a freshly loaded page would be slow.

		void navRouFun( { hash : '' }, { replace : true } ); // What: Hash Clear Call. Why: The address should stay as clean as it does for in-page links. How: This replaces the current history entry with the same path and no hash; void marks the returned promise as deliberately unawaited.


	}, [ hasValStr, navRouFun ] ); // What: Effect Dependency Array. Why: Each new hash has to be handled once. How: hasValStr changes when a section link arrives, and navRouFun is listed because the effect calls it, though it stays the same between renders.



	return (


		<>{ /* What: Home Page Fragment. Why: The bar, main content, and footer sit side by side with no wrapper of their own. How: This groups them without adding an element. */ }


			<NavBarCom />{ /* What: Navigation Bar Component. Why: The page starts with the shared top bar. How: This renders it above the content. */ }



			<main>{ /* What: Home Main Element. Why: The four sections are the page's main content. How: This wraps them in the main landmark, in reading order. */ }


				<HerSecCom />{ /* What: Hero Section Component. Why: The page opens with the headline and pitch. How: This renders the hero first. */ }



				<SerSecCom />{ /* What: Services Section Component. Why: Visitors see what the company does next. How: This renders the services second. */ }



				<AboSecCom />{ /* What: About Section Component. Why: The company's story follows its services. How: This renders the about section third. */ }



				<ConSecCom />{ /* What: Contact Section Component. Why: The page ends where visitors reach the company. How: This renders the contact section last. */ }


			</main>



			<SitFooCom />{ /* What: Site Footer Component. Why: The page ends with the shared footer. How: This renders it below the content. */ }


		</>


	);


}

// #endregion HomPagCom

// #endregion Components



// #region Exports

export { HomPagCom }; // What: Named Exports. Why: app.tsx renders the home page at the site's root. How: This exports HomPagCom.

// #endregion Exports


