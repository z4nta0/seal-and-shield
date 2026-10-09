


// #region Imports

import About   from './about.tsx';   // What: About. Why: The page tells the company's story third. How: This is rendered inside main, after the services.
import Contact from './contact.tsx'; // What: Contact. Why: The page ends where visitors reach the company. How: This is rendered last inside main.


import { HerSecCom } from './hero.tsx';          // What: Hero Section Component. Why: The page opens with the headline and pitch. How: This is rendered first inside main.
import { NavBarCom } from '../../ui/nav.tsx';    // What: Navigation Bar Component. Why: Every page starts with the shared top bar. How: This is rendered above main.
import { SerSecCom } from './services.tsx';      // What: Services Section Component. Why: The page lists what the company does second. How: This is rendered inside main, after the hero.
import { SitFooCom } from '../../ui/footer.tsx'; // What: Site Footer Component. Why: Every page ends with the shared footer. How: This is rendered below main.

// #endregion Imports



/**
 * home.tsx = Home Page
 *
 * @summary
 * The site's one page: the shared top bar, then the four sections in reading
 * order (the hero, services, about, and contact) inside the main landmark,
 * then the shared footer. It's the page the root path shows, and the 404
 * page added later sits beside it under pages/.
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
 * section links.
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


	return (


		<>{ /* What: Home Page Fragment. Why: The bar, main content, and footer sit side by side with no wrapper of their own. How: This groups them without adding an element. */ }


			<NavBarCom />{ /* What: Navigation Bar Component. Why: The page starts with the shared top bar. How: This renders it above the content. */ }



			<main>{ /* What: Home Main Element. Why: The four sections are the page's main content. How: This wraps them in the main landmark, in reading order. */ }


				<HerSecCom />{ /* What: Hero Section Component. Why: The page opens with the headline and pitch. How: This renders the hero first. */ }



				<SerSecCom />{ /* What: Services Section Component. Why: Visitors see what the company does next. How: This renders the services second. */ }



				<About />{ /* What: About. Why: The company's story follows its services. How: This renders the about section third. */ }



				<Contact />{ /* What: Contact. Why: The page ends where visitors reach the company. How: This renders the contact section last. */ }


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


