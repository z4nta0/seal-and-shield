


// #region Imports

import cssModObj from './not-found.module.css'; // What: CSS Module Object. Why: The page is styled in its own module, whose class names Vite hashes. How: Each element reads its class from this object.


import { Link         } from 'react-router';             // What: Link. Why: The return button should navigate home inside the site without a full page load. How: This renders it.
import { NavBarCom    } from '../../ui/nav.tsx';         // What: Navigation Bar Component. Why: The 404 page keeps the site's top bar, so every section stays within reach, in the bar's row above 768px wide or its menu at 768px and below. How: This is rendered first inside the page.
import { SitFooCom    } from '../../ui/footer.tsx';      // What: Site Footer Component. Why: The 404 page ends with the site's footer like every page. How: This is rendered last inside the page.
import { useSecCliFun } from '../../ui/section-link.ts'; // What: Use Section Click Function. Why: The quote button reaches the Contact section the way every section link does. How: This returns secCliFun, which navigates home to the section and leaves a Ctrl, Cmd, Shift, or Alt click to the browser, while a middle click, sent as auxclick, never reaches the handler.

// #endregion Imports



/**
 * not-found.tsx = Not Found Page
 *
 * @summary
 * The page every unknown path falls through to. Between the shared bar and
 * footer, it says the page doesn't exist and offers two ways onward: back
 * to the home page, or straight to the quote request in the Contact
 * section. It carries its own title and a noindex robots tag, since the
 * host answers every unknown path with a 200 and search engines shouldn't
 * index it. The page fills at least the screen's height, so the footer sits
 * at the bottom of a tall window rather than floating halfway up it.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region NotFouCom

/**
 * NotFouCom = Not Found Component
 *
 * @summary
 * Renders the 404 page: its title and robots tag, which React moves into the
 * head and removes again when the page leaves, the bar, then a main element
 * holding a centered column with an error label, the heading, a short
 * explanation, and two buttons, then the footer. The return button navigates
 * to the home page; the quote button is a link to /#contact that goes through
 * secCliFun, navigating to the home page with the Contact section's id as the
 * hash, which the home page scrolls to and then clears, while a Ctrl, Cmd, or
 * middle click opens it in a new tab. app.tsx renders it for every path no
 * other route claims.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The 404 page.
 *
 * @example
 * ```tsx
 * NotFouCom() // => <NotFouCom />
 * ```
 *
*/

function NotFouCom () : React.JSX.Element {


	const secCliFun = useSecCliFun(); // What: Section Click Function. Why: The quote button takes the visitor to the Contact section the way every section link does. How: This navigates home to the section and leaves a Ctrl, Cmd, Shift, or Alt click to the browser, while a middle click, sent as auxclick, never reaches the handler.



	return (


		<div className={ cssModObj.nofPagDiv }>{ /* What: Not-Found Page Div Element. Why: The footer should sit at the bottom of the screen on a page this short. How: This stacks the bar, main content, and footer in a column at least the screen's height. */ }


			<title>Page Not Found | Seal and Shield</title>{ /* What: Page Title Element. Why: A visitor's tab and history should say the address they tried doesn't exist. How: React 19 moves this title into the head ahead of index.html's own, and takes it out again when the page leaves, so the home page's title applies once more. */ }

			<meta
				name='robots'

				content='noindex'
			/>{ /* What: Robots Meta Element. Why: The host answers every unknown path with the site and a 200 status, so search engines would otherwise index this page under every mistyped address. How: React 19 moves this into the head while the page is shown, telling crawlers not to index it. */ }



			<NavBarCom />{ /* What: Navigation Bar Component. Why: The page starts with the shared top bar. How: This renders it above the content. */ }



			<main
				id='main'

				className={ cssModObj.nofConMai }

				tabIndex={ -1 } // What: Main Focus Target. Why: The skip link moves focus here, and a main element can't take focus on its own. How: This makes it focusable without adding it to the Tab order.
			>{ /* What: Not-Found Content Main Element. Why: The page's one message is its main content, and the skip link jumps here. How: This centers a single column in the dark space between the bar and the footer; its id stays the plain main, since the skip link's #main address names it as a navigation target. */ }


				<p className={ cssModObj.eyeLabPar }>Error 404</p>{ /* What: Eyebrow Label Paragraph Element. Why: A label names the error before the heading. How: This uses the site's eyebrow style. */ }

				<h1 className={ cssModObj.nofTitHea }>{ /* What: Not-Found Title Heading Element. Why: The page's heading states the problem plainly. How: This sets it in the display style, sized to the screen between two bounds by its module class. */ }
					Page Not <span className={ cssModObj.titAccSpa }>Found.</span>
				</h1>

				<p className={ cssModObj.nofLedPar }>The page you're looking for doesn't exist or has moved. Let's get you back home.</p>{ /* What: Not-Found Lede Paragraph Element. Why: Visitors should know what happened and what to do next. How: This sets the explanation in light silver at a readable width. */ }

				<div className={ cssModObj.nofActDiv }>{ /* What: Not-Found Actions Div Element. Why: The page's two ways onward sit together. How: This holds the return and quote buttons side by side, wrapping them onto two lines at about 347px wide and below. */ }


					<Link
						className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

						to='/'
					>{ /* What: Button Base Anchor Primary Link. Why: The page's main action is going back home. How: This navigates to the root path inside the site. */ }
						Return Home
					</Link>



					<a
						className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncSecondary } `}

						href='/#contact'

						onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'contact' ) }
					>{ /* What: Button Base Anchor Secondary Element. Why: A visitor who came looking for a roofer can still request a quote in one step, the site's main action. How: This quieter of the page's two buttons goes through secCliFun, which navigates to the home page's Contact section and leaves a Ctrl, Cmd, Shift, or Alt click to the browser, while a middle click, sent as auxclick, never reaches the handler. */ }
						Get a Free Quote
					</a>


				</div>


			</main>



			<SitFooCom />{ /* What: Site Footer Component. Why: The page ends with the shared footer. How: This renders it below the content. */ }


		</div>


	);


}

// #endregion NotFouCom

// #endregion Components



// #region Exports

export { NotFouCom }; // What: Named Export. Why: app.tsx renders the 404 page for unknown paths. How: This exports NotFouCom.

// #endregion Exports


