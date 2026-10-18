


// #region Imports

import cssModObj from './nav.module.css';           // What: CSS Module Object. Why: The bar is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.
import losWebUrl from '../assets/logo-simple.webp'; // What: Logo-Simple WebP URL. Why: The bar's brand opens with the simple mark. How: Vite resolves this to the image's fingerprinted URL, which the brand's img element loads.


import { useEffect    } from 'react';             // What: Use Effect. Why: The bar listens to the page's scroll position, and the open menu changes the page around it. How: This registers the scroll and menu listeners and removes them again.
import { useLocation  } from 'react-router';      // What: Use Location. Why: Only the home page has sections to mark active. How: This reads the current path.
import { useRef       } from 'react';             // What: Use Ref. Why: The open menu needs the bar, the dimmer, and the menu button. How: This creates the refs those elements attach.
import { useSecCliFun } from './section-link.ts'; // What: Use Section Click Function. Why: Section links have to work from every page, and a Ctrl, Cmd, or middle click should open them in a new tab. How: This returns secCliFun, the shared click handler, which reports whether it handled the click.
import { useState     } from 'react';             // What: Use State. Why: The bar tracks its scrolled look, the active section, and whether the menu is open. How: This holds each of the three.

// #endregion Imports



/**
 * nav.tsx = Navigation
 *
 * @summary
 * The site's fixed top bar: the brand, then above 768px wide the section
 * links and the phone number in a row, and at 768px and below a menu button
 * that opens the same links and phone number in a panel below the bar. The
 * bar takes on a solid background once the page scrolls past its top, and
 * the link for whichever section the visitor is reading is marked active on
 * the home page. Every section link closes the menu and reaches its section
 * through section-link.ts: in place on the home page, smoothly unless the
 * visitor asked for reduced motion, or by navigating home from any other
 * page.
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

/**
 * NAV_LIN_ARR = Navigation Link Array
 *
 * @summary
 * The section links the bar and the mobile menu both render, in page order.
 * Every row shares one shape, so its fields carry no comments of their own:
 *
 * - `ideStr` (String): Identifier String, the section's id, which the
 *   link's href names on the home page's path, e.g. /#about.
 *
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



const SEC_IDE_ARR = [ 'home', 'services', 'about', 'contact' ]; // What: Section Identifier Array. Why: The scroll handler finds the section being read by checking each section's position. How: This lists the sections' ids in page order, which the handler walks from the bottom up.

// #endregion Constants



// #region Components

// #region NavBarCom

/**
 * NavBarCom = Navigation Bar Component
 *
 * @summary
 * Renders the fixed top bar and its mobile menu. Above 768px wide the bar
 * shows the section links and the phone button in a row; at 768px and below
 * that row hides and a menu button takes its place. A scroll listener gives
 * the bar its solid scrolled look once the page moves more than 40px, and
 * marks the link of the section the visitor is reading as active on the home
 * page: the last section whose top sits within 120px of the top of the
 * screen, which leaves room for the bar itself. The menu button toggles the
 * mobile menu, which drops down below the bar over a dimmed page: its links
 * enter one after another and end with a contact block, and while it's open
 * the page around the bar is inert, a tap on the dimmed page or Escape
 * closes it, and widening the screen past 768px closes it too. The closed
 * menu is inert, so its links stay out of the focus order and the
 * accessibility tree. Every section link, including the brand, goes through
 * navSecFun, which reaches the section from any page and closes the menu,
 * while a Ctrl, Cmd, Shift, or Alt click is left to the browser and leaves
 * the menu as it was, and a middle click, which the browser sends as
 * auxclick, never reaches navSecFun at all.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The dimmer behind the menu and the bar's header element, which
 *          holds the bar and the mobile menu.
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



	// #region Menu And Section Navigation

	const [ menOpeBoo, setMenOpeBoo ] = useState( false ); // What: Menu Open Boolean And Setter. Why: The mobile menu opens and closes from its button. How: This holds whether it's open, starting closed.

	const navBarRef = useRef< HTMLElement >( null );       // What: Navigation Bar Reference. Why: The open menu makes everything beside the bar inert. How: This points at the bar, whose parent holds the page's other content.
	const scrDivRef = useRef< HTMLDivElement >( null );    // What: Scrim Div Reference. Why: The dimmer has to stay clickable while the rest of the page is inert. How: This points at the dimmer, so it's left out.
	const togButRef = useRef< HTMLButtonElement >( null ); // What: Toggle Button Reference. Why: Escape hands focus back to the button that opened the menu, and a hidden button means the menu no longer applies. How: This points at the menu button.



	const secCliFun = useSecCliFun(); // What: Section Click Function. Why: Every section link in the bar and the menu reaches its section the same way. How: This leaves a modified click to the browser and otherwise scrolls to the section or navigates home to it, reporting whether it handled the click.


	// #region navSecFun

	/**
	 * navSecFun = Navigate Section Function
	 *
	 * @summary
	 * Handles a click on any section link, the brand and the menu's quote
	 * button included, by handing it to secCliFun, which leaves a Ctrl, Cmd,
	 * Shift, or Alt click to the browser and otherwise scrolls to the
	 * section on the home page, smoothly unless the visitor asked for
	 * reduced motion, or navigates home to it from any other page. A middle
	 * click, which the browser sends as auxclick, never reaches it. The
	 * mobile menu closes only when secCliFun handled the click, so a link
	 * opened in a new tab leaves it open.
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

	const navSecFun = ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Navigate Section Function. Why: Every section link reaches its section without a full page load or a hash left in the address. How: This hands the click to secCliFun and closes the menu when it was handled.


		if ( secCliFun( cliEveObj, secIdeStr ) ) setMenOpeBoo( false ); // What: Handled Click Close. Why: The menu should get out of the way once a link takes the visitor to a section, but not when the link opened in a new tab. How: This closes it only when secCliFun reports the click handled.


	};

	// #endregion navSecFun



	useEffect( () => { // What: Modal Menu Effect. Why: The open menu sits over a dimmed page, so keyboard and screen reader users should stay in the bar and menu until it closes. How: While the menu is open, this makes the bar's siblings inert, closes on Escape, and closes when the menu button disappears.


		if ( !menOpeBoo ) return; // What: Closed Menu Guard. Why: Only the open menu changes the rest of the page. How: This leaves everything alone while the menu is closed.



		const navBarEle = navBarRef.current!; // What: Navigation Bar Element. Why: The bar and its menu stay usable. How: This reads the bar. // What: Non-Null Note. Why: TypeScript can't see the ref is attached. How: Effects run after React attaches refs, and the bar always renders.
		const scrDivEle = scrDivRef.current!; // What: Scrim Div Element. Why: The dimmer stays clickable to close the menu. How: This reads the dimmer. // What: Non-Null Note. Why: TypeScript can't see the ref is attached. How: Effects run after React attaches refs, and the dimmer always renders.
		const sibEleArr = Array.from( navBarEle.parentElement!.children ).filter( ( sibCurEle ) => sibCurEle !== navBarEle && sibCurEle !== scrDivEle ); // What: Sibling Element Array. Why: The page's main content and footer sit beside the bar and the dimmer. How: This collects every child of the bar's parent except those two. // What: Non-Null Note. Why: TypeScript can't see the bar has a parent. How: The bar always renders inside its page.
		const togButEle = togButRef.current!; // What: Toggle Button Element. Why: Escape returns focus here, and its visibility says whether the menu still applies. How: This reads the menu button. // What: Non-Null Note. Why: TypeScript can't see the ref is attached. How: Effects run after React attaches refs, and the button always renders.


		const onKeyDowFun = ( keyEveObj : KeyboardEvent ) => { // What: On Key Down Function. Why: Escape is the expected way out of a layer over the page. How: This closes the menu and puts focus back on its button when Escape is pressed.


			if ( keyEveObj.key !== 'Escape' ) return; // What: Escape Key Guard. Why: Only Escape closes the menu. How: This ignores every other key.



			setMenOpeBoo( false ); // What: Menu Close Call. Why: Escape closes the menu. How: This sets the menu state to closed.

			togButEle.focus(); // What: Toggle Focus Call. Why: Focus would otherwise be left inside the closing menu. How: This moves it to the menu button, where the visitor opened the menu.


		};


		const onResWinFun = () => { if ( !togButEle.getClientRects().length ) setMenOpeBoo( false ); }; // What: On Resize Window Function. Why: A screen widened past the menu's breakpoint hides the menu button, which would leave the page inert under a menu that no longer shows. How: This closes the menu once the button has no box.



		for ( const sibCurEle of sibEleArr ) sibCurEle.setAttribute( 'inert', '' ); // What: Sibling Inert Loop. Why: Content under the dimmer shouldn't take focus or be read while the menu is open. How: This marks each sibling inert.



		document.addEventListener( 'keydown', onKeyDowFun ); // What: Key Down Listener Registration. Why: Escape should close the menu wherever focus is. How: This listens on the whole document.
		window.addEventListener( 'resize', onResWinFun );    // What: Resize Listener Registration. Why: Widening the screen can hide the menu button. How: This rechecks on every resize.



		return () => { // What: Modal Menu Cleanup. Why: Closing the menu gives the page back. How: This removes the inert marks and both listeners.


			for ( const sibCurEle of sibEleArr ) sibCurEle.removeAttribute( 'inert' ); // What: Sibling Restore Loop. Why: The page has to be usable again once the menu closes. How: This removes each sibling's inert mark.



			document.removeEventListener( 'keydown', onKeyDowFun ); // What: Key Down Listener Cleanup. Why: Escape should do nothing once the menu is closed. How: This removes the listener.
			window.removeEventListener( 'resize', onResWinFun );    // What: Resize Listener Cleanup. Why: Resizing doesn't matter once the menu is closed. How: This removes the listener.


		};


	}, [ menOpeBoo ] ); // What: Effect Dependency Array. Why: The page's inert state and the listeners have to follow the menu opening and closing. How: menOpeBoo changing reruns the effect, which applies them while it's true and cleans them up when it turns false.

	// #endregion Menu And Section Navigation



	return (


		<>{ /* What: Navigation Fragment. Why: The dimmer and the bar render together, the dimmer first so the bar, at the same stack level, paints above it. How: This groups them without adding a wrapper element. */ }


			<div
				ref={ scrDivRef }

				className={ cssModObj.navScrDiv }

				data-mobile-menu-open={ menOpeBoo || undefined } // What: Mobile Menu Open Attribute. Why: The dimmer fades in only while the menu is open. How: This is set only while menOpeBoo is true, and React drops it otherwise.

				aria-hidden='true'

				onClick={ () => setMenOpeBoo( false ) }
			/>{ /* What: Navigation Scrim Div Element. Why: The open menu should stand apart from the dimmed page, and a tap anywhere on the page should close it. How: At 768px wide and below, the only width where the menu exists, this covers the page under the bar, dimmed while the menu is open, and closes the menu when tapped; it's hidden from screen readers, which reach Escape and the menu button instead. */ }



			<header
				ref={ navBarRef }

				className={ cssModObj.navBarHed }

				data-mobile-menu-open={ menOpeBoo || undefined } // What: Mobile Menu Open Attribute. Why: The bar turns solid while the menu is open, so the two read as one panel above the dimmed page. How: This is set only while menOpeBoo is true, and React drops it otherwise.
				data-page-scroll-active={ barScrBoo || undefined } // What: Page Scroll Active Attribute. Why: The bar turns solid once the page scrolls under it. How: This sets the attribute only while barScrBoo is true, and drops it otherwise.
			>{ /* What: Navigation Bar Header Element. Why: The bar and its mobile menu form the page's banner. How: This holds both, and carries data-page-scroll-active while the page is scrolled, which turns the bar solid. */ }


				<div className={ cssModObj.navInnDiv }>{ /* What: Navigation Inner Div Element. Why: The bar's contents line up with the page's content width. How: This spaces the brand and either the links row, above 768px wide, or the menu button, at 768px and below, across a centered, capped-width row. */ }


					<a
						className={ cssModObj.navBraAnc }

						href='/#home'

						onClick={ ( cliEveObj ) => navSecFun( cliEveObj, 'home' ) }
					>{ /* What: Navigation Brand Anchor Element. Why: The brand doubles as a way back to the top. How: This reaches the hero section through navSecFun, from any page. */ }


						<img
							className={ cssModObj.navLogIma }

							height={ 133 } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.
							src={ losWebUrl }
							width={ 157 } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.

							alt=''
						/>{ /* What: Navigation Logo Image Element. Why: The bar's brand opens with the simple mark. How: Its alt text is empty, since the brand name sits right beside it. */ }

						<span className={ cssModObj.braTexSpa }>{ /* What: Brand Text Span Element. Why: The name and its LLC stack as one block beside the mark. How: This holds the two lines. */ }


							<span className={ cssModObj.braMaiSpa }>Seal and Shield</span>{ /* What: Brand Main Span Element. Why: The company's name is the brand's main line. How: This shows it in the display font. */ }

							<span className={ cssModObj.braSubSpa }>LLC</span>{ /* What: Brand Sub Span Element. Why: The legal suffix completes the brand without competing with the name. How: This shows it small beneath the name. */ }


						</span>


					</a>

					<nav
						className={ cssModObj.navLinNav }

						aria-label='Main'
					>{ /* What: Navigation Links Nav Element. Why: Above 768px wide the bar shows the section links and phone number here, while at 768px and below this row hides and the menu takes over. How: This labels the landmark Main, telling it apart from the footer's. */ }


						{ NAV_LIN_ARR.map( ( linRecObj ) => ( // What: Bar Link Map. Why: Each section gets a link in the bar. How: This renders one anchor per row.


							<a
								key={ linRecObj.labStr }

								className={ cssModObj.navLinAnc }

								data-section-link-active={ ( isaHomBoo && actSecStr === linRecObj.ideStr ) || undefined } // What: Active Section Link Flag. Why: The link for the section being read is highlighted. How: This sets the attribute only on the home page when the link names the active section, and drops it otherwise.

								href={ `/#${ linRecObj.ideStr }` } // What: Section Address. Why: The link has to name the home page's path so it works from any page, as a real link too. How: This points at the home page with the section's id as the hash.

								onClick={ ( cliEveObj ) => navSecFun( cliEveObj, linRecObj.ideStr ) }
							>{ /* What: Navigation Link Anchor Element. Why: Each link scrolls to its section. How: This is marked active while its section is being read, and hides with its row at 768px wide and below. */ }
								{ linRecObj.labStr }
							</a>


						))}

						<a
							className={ cssModObj.navCtaAnc }

							href='tel:7853041957'
						>{ /* What: Navigation Call-To-Action Anchor Element. Why: Calling is the fastest way to reach the company. How: This dials its number, and hides with its row at 768px wide and below, where the menu's call button takes over. */ }
							(785) 304-1957
						</a>


					</nav>

					<button
						ref={ togButRef }

						className={ cssModObj.navTogBut }

						aria-expanded={ menOpeBoo }
						aria-label='Toggle menu'

						onClick={ () => setMenOpeBoo( ( preOpeBoo ) => !preOpeBoo ) }
					>{ /* What: Navigation Toggle Button Element. Why: At 768px wide and below the section links move into a menu. How: This shows only at that width, toggles the mobile menu, and reports whether it's open. */ }


						<span className={ cssModObj.togLinSpa } />{ /* What: Toggle Line Span Element. Why: Three bars draw the menu icon, shown with their button at 768px wide and below, turning into a cross while it's open. How: This is the top bar, which drops to the middle and turns 45 degrees while the menu is open. */ }

						<span className={ cssModObj.togLinSpa } />{ /* What: Toggle Line Span Element. Why: Three bars draw the menu icon, shown with their button at 768px wide and below, turning into a cross while it's open. How: This is the middle bar, which fades out while the menu is open. */ }

						<span className={ cssModObj.togLinSpa } />{ /* What: Toggle Line Span Element. Why: Three bars draw the menu icon, shown with their button at 768px wide and below, turning into a cross while it's open. How: This is the bottom bar, which lifts to the middle and turns the other way while the menu is open. */ }


					</button>


				</div>



				<div
					className={ cssModObj.navMenDiv }

					data-mobile-menu-open={ menOpeBoo || undefined } // What: Mobile Menu Open Attribute. Why: The menu slides open and its links play their entrance only while it's open. How: This sets the attribute only while menOpeBoo is true, and drops it otherwise.

					inert={ !menOpeBoo } // What: Closed Menu Inert Flag. Why: The closed menu only collapses to zero height, so its links would otherwise still take keyboard focus while hidden. How: This makes the menu inert whenever it's closed.
				>{ /* What: Navigation Menu Div Element. Why: At 768px wide and below, the section links and phone number move into a panel below the bar. How: This exists only at that width, opening and closing with the menu button, carrying data-mobile-menu-open while it's open. */ }


					{ NAV_LIN_ARR.map( ( linRecObj, linIndNum ) => ( // What: Menu Link Map. Why: Each section gets a link in the mobile menu. How: This renders one anchor per row, handing each its position for the staggered entrance.


						<a
							key={ linRecObj.labStr }

							className={ cssModObj.menLinAnc }

							style={ { '--men-ite-ind' : linIndNum } as React.CSSProperties } // What: Menu Item Index Style. Why: Each row enters a beat after the one above it. How: This hands the row its position, which its stylesheet multiplies into an animation delay. // What: Type Assertion Note. Why: React's style type has no entry for a custom property. How: as React.CSSProperties accepts the object, which React sets as written.

							data-section-link-active={ ( isaHomBoo && actSecStr === linRecObj.ideStr ) || undefined } // What: Active Section Link Flag. Why: The menu marks the section being read, as the bar's links do. How: This sets the attribute on the link whose section is active, on the home page only.

							href={ `/#${ linRecObj.ideStr }` } // What: Section Address. Why: The link has to name the home page's path so it works from any page, and so a new tab opened from it lands on the section. How: This points at the home page with the section's id as the hash.

							onClick={ ( cliEveObj ) => navSecFun( cliEveObj, linRecObj.ideStr ) }
						>{ /* What: Menu Link Anchor Element. Why: Each link takes the visitor to its section. How: This goes through navSecFun, which closes the menu when it handles the click, and shows a dot at its end while its section is being read (the menu exists only at 768px wide and below). */ }


							<span className={ cssModObj.menLabSpa }>{ linRecObj.labStr }</span>{ /* What: Menu Label Span Element. Why: The label slides a little on hover while the row's divider stays put. How: This holds the link's text (the menu exists only at 768px wide and below). */ }


						</a>


					))}


					<div
						className={ cssModObj.menConDiv }

						style={ { '--men-ite-ind' : NAV_LIN_ARR.length } as React.CSSProperties } // What: Menu Item Index Style. Why: The contact block enters after the last link. How: This hands it the position after the links, which its stylesheet multiplies into an animation delay. // What: Type Assertion Note. Why: React's style type has no entry for a custom property. How: as React.CSSProperties accepts the object, which React sets as written.
					>{ /* What: Menu Contact Div Element. Why: The menu ends with every way to reach the company, since the bar's phone button hides at 768px wide and below, the only width where the menu exists. How: This stacks a label, the call and quote buttons, and the hours and service area. */ }


						<span className={ cssModObj.conLabSpa }>Get in touch</span>{ /* What: Contact Label Span Element. Why: A small label introduces the contact block like the sections' labels. How: This reads in spaced light blue capitals (the menu exists only at 768px wide and below). */ }

						<div className={ cssModObj.menActDiv }>{ /* What: Menu Actions Div Element. Why: The two ways to get in touch sit side by side. How: This lays the call and quote buttons out in two equal columns (the menu exists only at 768px wide and below). */ }


							<a
								className={ cssModObj.menCtaAnc }

								href='tel:7853041957'
							>{ /* What: Menu Call-To-Action Anchor Element. Why: Calling is the fastest way to reach the company. How: This dials its number from the menu, which exists only at 768px wide and below. */ }
								(785) 304-1957
							</a>

							<a
								className={ cssModObj.menQuoAnc }

								href='/#contact'

								onClick={ ( cliEveObj ) => navSecFun( cliEveObj, 'contact' ) }
							>{ /* What: Menu Quote Anchor Element. Why: Requesting a quote is the site's main goal. How: This takes the visitor to the contact form through navSecFun, closing the menu when it handles the click (the menu exists only at 768px wide and below). */ }
								Free Quote
							</a>


						</div>

						<p className={ cssModObj.menInfPar }>{ /* What: Menu Info Paragraph Element. Why: Visitors want to know when someone will answer and whether the company works in their area. How: This gives the weekday hours and the service area on two lines (the menu exists only at 768px wide and below). */ }
							Monday – Friday, 8 a.m. – 5 p.m.<br />
							Serving Lawrence, Topeka, and Kansas City
						</p>


					</div>


				</div>


			</header>


		</>


	);


}

// #endregion NavBarCom

// #endregion Components



// #region Exports

export { NavBarCom }; // What: Named Export. Why: Every page renders the bar above its content. How: This exports NavBarCom.

// #endregion Exports


