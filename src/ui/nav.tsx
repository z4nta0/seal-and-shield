


// #region Imports

import cssModObj from './nav.module.css';           // What: CSS Module Object. Why: The bar is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.
import losWebUrl from '../assets/logo-simple.webp'; // What: Logo-Simple WebP URL. Why: The bar's brand opens with the simple mark. How: Vite resolves this to the image's fingerprinted URL, which the brand's img element loads.


import { useEffect    } from 'react';              // What: Use Effect. Why: The bar listens to the page's scroll position. How: This registers and removes the scroll listener.
import { useLocation  } from 'react-router';       // What: Use Location. Why: Only the home page has sections to mark active. How: This reads the current path.
import { useSecLinFun } from './section-link.ts';  // What: Use Section Link Function. Why: Section links have to work from every page, not only the home page. How: This returns the function that scrolls to a section or navigates home to it.
import { useState     } from 'react';              // What: Use State. Why: The bar tracks its scrolled look, the active section, and whether the menu is open. How: This holds each of the three.

// #endregion Imports



/**
 * nav.tsx = Navigation
 *
 * @summary
 * The site's fixed top bar: the brand, the section links with the phone
 * number on wide screens, and a menu button that opens the same links and
 * phone number in a panel below the bar on phones. The bar takes on a solid
 * background once the page scrolls past its top, and the link for whichever
 * section the visitor is reading is marked active on the home page. Every
 * section link closes the menu and reaches its section through
 * section-link.ts: in place on the home page, smoothly unless the visitor
 * asked for reduced motion, or by navigating home from any other page.
 *
 * Sections:
 *  - Constants
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

// #region NAV_LIN_ARR

/**
 * NAV_LIN_ARR = Navigation Link Array
 *
 * @summary
 * The section links the bar and the mobile menu both render, in page order.
 * Every row shares one shape, so its fields carry no comments of their own:
 * - `ideStr` (String): Identifier String, the section's id, which the
 *   link's href names on the home page's path, e.g. /#about.
 * - `labStr` (String): Label String, the link's visible text and React key.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const NAV_LIN_ARR = [ // What: Navigation Link Array. Why: The bar and the mobile menu list the same links, so they're defined once. How: Each row pairs a section's id with the link's label.


	{ ideStr : 'home',     labStr : 'Home'     }, // What: Home Link Row. Why: Visitors need a way back to the top. How: This links to the hero section.
	{ ideStr : 'services', labStr : 'Services' }, // What: Services Link Row. Why: The services are the site's main content. How: This links to the services section.
	{ ideStr : 'about',    labStr : 'About'    }, // What: About Link Row. Why: Visitors check who they'd be hiring. How: This links to the about section.
	{ ideStr : 'contact',  labStr : 'Contact'  }  // What: Contact Link Row. Why: The page's goal is a quote request. How: This links to the contact section.


];

// #endregion NAV_LIN_ARR



const SEC_IDE_ARR = [ 'home', 'services', 'about', 'contact' ]; // What: Section Identifier Array. Why: The scroll handler finds the section being read by checking each section's position. How: This lists the sections' ids in page order, which the handler walks from the bottom up.

// #endregion Constants



// #region Components

// #region NavBarCom

/**
 * NavBarCom = Navigation Bar Component
 *
 * @summary
 * Renders the fixed top bar and its mobile menu. A scroll listener gives the
 * bar its solid scrolled look once the page moves more than 40px, and marks
 * the link of the section the visitor is reading as active on the home
 * page: the last section
 * whose top sits within 120px of the top of the screen, which leaves room
 * for the bar itself. The menu button toggles the mobile menu, which is
 * inert while closed, so its links stay out of the focus order and the
 * accessibility tree. Every section link, including the brand, goes through
 * navSecFun, which closes the menu and reaches the section from any page.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The bar's header element, holding the bar and the mobile menu.
 *
 * @example
 * ```tsx
 * NavBarCom() // => <NavBarCom />
 * ```
 *
*/

function NavBarCom () : React.JSX.Element {


	// #region Scroll Tracking

	const [ actSecStr, setActSecStr ] = useState( 'home' ); // What: Active Section String And Setter. Why: The link for the section being read is marked active. How: This holds that section's id, starting at the top of the page.
	const [ barScrBoo, setBarScrBoo ] = useState( false );  // What: Bar Scrolled Boolean And Setter. Why: The bar gains a solid background once the page scrolls. How: This holds whether the page has scrolled past the bar's threshold.

	const isaHomBoo = useLocation().pathname === '/'; // What: Is-A Home Boolean. Why: Only the home page has sections, so no link is active anywhere else. How: This is true when the path is the site's root.


	useEffect( () => { // What: Scroll Listener Effect. Why: The bar's look and active link follow the scroll position. How: This registers the scroll handler once and removes it when the bar unmounts.


		// #region onWinScrFun

		/**
		 * onWinScrFun = On Window Scroll Function
		 *
		 * @summary
		 * Runs on every scroll. It sets the bar's scrolled look once the page
		 * has moved more than 40px, then walks the sections from the bottom
		 * of the page up and marks the first one whose top sits within 120px
		 * of the top of the screen as active, so the active link changes as
		 * a section reaches the space just below the bar.
		 *
		 * @author z4nta0 <https://github.com/z4nta0>
		 *
		 * @param void - This function takes no parameters.
		 *
		 * @returns This function does not return anything.
		 *
		 * @example
		 * ```ts
		 * onWinScrFun() // => void
		 * ```
		 *
		*/

		const onWinScrFun = () => { // What: On Window Scroll Function. Why: The bar reacts to every scroll. How: This updates the scrolled look and the active section.


			setBarScrBoo( window.scrollY > 40 ); // What: Bar Scrolled Update. Why: The bar should turn solid as soon as content starts sliding under it. How: This marks it scrolled once the page has moved more than 40px.


			for ( const secIdeStr of [ ...SEC_IDE_ARR ].reverse() ) { // What: Section Walk Loop. Why: The active section is the lowest one that has reached the top of the screen. How: This walks a reversed copy of the section ids, from the bottom of the page up.


				const secCurEle = document.getElementById( secIdeStr ); // What: Section Current Element. Why: The section's position decides whether it's active. How: This looks the section up by its id.


				if ( secCurEle && window.scrollY >= secCurEle.offsetTop - 120 ) { // What: Section Reached Check. Why: A section counts as being read once its top nears the top of the screen. How: This allows 120px for the bar above it.


					setActSecStr( secIdeStr ); // What: Active Section Update. Why: Its link should be marked active. How: This stores the section's id.

					break; // What: Walk Stop. Why: Only the lowest reached section is active. How: This ends the walk at the first match.


				}


			}


		};

		// #endregion onWinScrFun



		window.addEventListener( 'scroll', onWinScrFun, { passive : true } ); // What: Scroll Listener Registration. Why: The handler has to run as the page scrolls. How: This adds it as a passive listener, which never blocks scrolling.



		return () => window.removeEventListener( 'scroll', onWinScrFun ); // What: Scroll Listener Cleanup. Why: An unmounted bar shouldn't keep handling scrolls. How: This removes the listener.


	}, [] ); // What: Effect Dependency Array. Why: The listener only has to be registered once. How: An empty list runs the effect on mount and its cleanup on unmount.

	// #endregion Scroll Tracking



	// #region Section Navigation

	const [ menOpeBoo, setMenOpeBoo ] = useState( false ); // What: Menu Open Boolean And Setter. Why: The mobile menu opens and closes from its button. How: This holds whether it's open, starting closed.

	const goSecFun = useSecLinFun(); // What: Go Section Function. Why: Each link has to reach its section from any page. How: This scrolls to the section on the home page, or navigates home to it from anywhere else.


	// #region navSecFun

	/**
	 * navSecFun = Navigate Section Function
	 *
	 * @summary
	 * Handles a click on any section link, the brand included: stops the
	 * browser's own navigation to the link's address, closes the mobile menu,
	 * and hands the section's id to goSecFun, which scrolls to it on the home
	 * page, smoothly unless the visitor asked for reduced motion, or navigates
	 * home to it from any other page.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param cliEveObj - Click Event Object: The link's click event.
	 * @param secIdeStr - Section Identifier String: The section's id, e.g.
	 *                    'about'.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * navSecFun(cliEveObj, 'about') // => void
	 * ```
	 *
	*/

	const navSecFun = ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Navigate Section Function. Why: Every section link reaches its section without a full page load or a hash left in the address. How: This cancels the link's own navigation, closes the menu, and hands the section to goSecFun.


		cliEveObj.preventDefault(); // What: Default Navigation Cancel. Why: The browser would otherwise jump or reload and leave the hash in the address. How: This stops the link's own navigation.

		setMenOpeBoo( false ); // What: Menu Close Call. Why: The menu should get out of the way once a link is chosen. How: This closes it.


		goSecFun( secIdeStr ); // What: Section Go Call. Why: The visitor should land on the section they chose. How: This scrolls to it, or navigates home to it from another page.


	};

	// #endregion navSecFun

	// #endregion Section Navigation



	return (


		<header
			className={ cssModObj.navBarHed }

			data-page-scroll-active={ barScrBoo || undefined }
		>{ /* What: Navigation Bar Header Element. Why: The bar and its mobile menu form the page's banner. How: This holds both, and carries data-page-scroll-active while the page is scrolled, which turns the bar solid. */ }


			<div className={ cssModObj.navInnDiv }>{ /* What: Navigation Inner Div Element. Why: The bar's contents line up with the page's content width. How: This spaces the brand, links, and menu button across a centered, capped-width row. */ }


				<a
					className={ cssModObj.navBraAnc }

					href='/#home'

					onClick={ ( cliEveObj ) => navSecFun( cliEveObj, 'home' ) }
				>{ /* What: Navigation Brand Anchor Element. Why: The brand doubles as a way back to the top. How: This reaches the hero section through navSecFun, from any page. */ }


					<img
						className={ cssModObj.navLogIma }

						height={ 133 }
						src={ losWebUrl }
						width={ 157 } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.

						alt=''
					/>{ /* What: Navigation Logo Image Element. Why: The bar's brand opens with the simple mark. How: Its alt text is empty, since the brand name sits right beside it. */ }

					<span className={ cssModObj.braTexSpa }>{ /* What: Navigation Brand Span Element. Why: The name and its LLC stack as one block beside the mark. How: This holds the two lines. */ }


						<span className={ cssModObj.braMaiSpa }>Seal and Shield</span>{ /* What: Brand Main Span Element. Why: The company's name is the brand's main line. How: This shows it in the display font. */ }

						<span className={ cssModObj.braSubSpa }>LLC</span>{ /* What: Brand Sub Span Element. Why: The legal suffix completes the brand without competing with the name. How: This shows it small beneath the name. */ }


					</span>


				</a>

				<nav
					className={ cssModObj.navLinNav }

					aria-label='Main'
				>{ /* What: Navigation Links Nav Element. Why: Wide screens show the section links and phone number in the bar. How: This labels the landmark Main, telling it apart from the footer's. */ }


					{ NAV_LIN_ARR.map( ( linRcdObj ) => ( // What: Bar Link Map. Why: Each section gets a link in the bar. How: This renders one anchor per row.


						<a
							key={ linRcdObj.labStr }

							className={ cssModObj.navLinAnc }

							data-section-link-active={ ( isaHomBoo && actSecStr === linRcdObj.ideStr ) || undefined } // What: Active Section Link Flag. Why: The link for the section being read is highlighted. How: This sets the attribute only on the home page when the link names the active section, and drops it otherwise.

							href={ `/#${ linRcdObj.ideStr }` } // What: Section Address. Why: The link has to name the home page's path so it works from any page, as a real link too. How: This points at the home page with the section's id as the hash.

							onClick={ ( cliEveObj ) => navSecFun( cliEveObj, linRcdObj.ideStr ) }
						>{ /* What: Navigation Link Anchor Element. Why: Each link scrolls to its section. How: This is marked active while its section is being read. */ }
							{ linRcdObj.labStr }
						</a>


					))}

					<a
						className={ cssModObj.navCtaAnc }

						href='tel:7853041957'
					>{ /* What: Navigation Call-To-Action Anchor Element. Why: Calling is the fastest way to reach the company. How: This dials its number on phones. */ }
						(785) 304-1957
					</a>


				</nav>

				<button
					className={ cssModObj.navTogBut }

					aria-expanded={ menOpeBoo }
					aria-label='Toggle menu'

					onClick={ () => setMenOpeBoo( ( preOpeBoo ) => !preOpeBoo ) }
				>{ /* What: Navigation Toggle Button Element. Why: Phones reach the section links through a menu. How: This toggles the mobile menu and reports whether it's open. */ }


					<span className={ cssModObj.togLinSpa } />{ /* What: Toggle Line Span Element. Why: Three bars draw the menu icon, turning into a cross while it's open. How: This is one of the three, crossed by the button's aria-expanded state. */ }

					<span className={ cssModObj.togLinSpa } />{ /* What: Toggle Line Span Element. Why: Three bars draw the menu icon, turning into a cross while it's open. How: This is one of the three, crossed by the button's aria-expanded state. */ }

					<span className={ cssModObj.togLinSpa } />{ /* What: Toggle Line Span Element. Why: Three bars draw the menu icon, turning into a cross while it's open. How: This is one of the three, crossed by the button's aria-expanded state. */ }


				</button>


			</div>


			<div
				className={ cssModObj.navMenDiv }

				data-mobile-menu-open={ menOpeBoo || undefined }

				inert={ !menOpeBoo } // What: Closed Menu Inert Flag. Why: The closed menu only collapses to zero height, so its links would otherwise still take keyboard focus while hidden. How: This makes the menu inert whenever it's closed.
			>{ /* What: Navigation Menu Div Element. Why: Phones show the section links and phone number in a panel below the bar. How: This opens and closes with the menu button, carrying data-mobile-menu-open while it's open. */ }


				{ NAV_LIN_ARR.map( ( linRcdObj ) => ( // What: Menu Link Map. Why: Each section gets a link in the mobile menu. How: This renders one anchor per row.


					<a
						key={ linRcdObj.labStr }

						className={ cssModObj.menLinAnc }

						href={ `/#${ linRcdObj.ideStr }` } // What: Section Address. Why: The link has to name the home page's path so it works from any page, as a real link too. How: This points at the home page with the section's id as the hash.

						onClick={ ( cliEveObj ) => navSecFun( cliEveObj, linRcdObj.ideStr ) }
					>{ /* What: Menu Link Anchor Element. Why: Each link scrolls to its section. How: This also closes the menu through navSecFun. */ }
						{ linRcdObj.labStr }
					</a>


				))}

				<a
					className={ cssModObj.menCtaAnc }

					href='tel:7853041957'
				>{ /* What: Menu Call-To-Action Anchor Element. Why: Calling is the fastest way to reach the company. How: This dials its number from the menu. */ }
					(785) 304-1957
				</a>


			</div>


		</header>


	);


}

// #endregion NavBarCom

// #endregion Components



// #region Exports

export { NavBarCom }; // What: Named Exports. Why: The home page renders the bar above its content. How: This exports NavBarCom.

// #endregion Exports


