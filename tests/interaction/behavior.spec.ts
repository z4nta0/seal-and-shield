


// #region Imports

import { expect    } from '@playwright/test';      // What: Expect. Why: Each behavior passes only when the page ends up where it should. How: This asserts on URLs, attributes, text, and positions.
import { fakNetFun } from '../support/netlify.ts'; // What: Fake Netlify Function. Why: The form checks need Netlify's answer without sending anything. How: This answers the form's posts in the browser with a chosen status.
import { test      } from '@playwright/test';      // What: Test. Why: Each behavior is its own test. How: This declares them.


import type { Locator } from '@playwright/test'; // What: Locator. Why: The new tab checks pass click options a locator's click takes. How: This types those options.
import type { Page    } from '@playwright/test'; // What: Page. Why: Every helper drives a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * behavior.spec.ts = Behavior Spec
 *
 * @summary
 * Checks what the site's controls actually do, in whichever engine the project
 * runs. The bar's section links, the brand, the hero's buttons, and the
 * footer's section links land on their sections and leave the address free of
 * hashes, while a Ctrl, Cmd, or middle click opens a section in a new tab and
 * leaves the page clicked from alone; the first Tab on each page reaches the
 * skip link, on screen, and clicking it moves focus to the main content with a
 * clean address; the mobile menu opens over an inert page, closes on its
 * button, Escape (which returns focus to the button), a tap on the dimmed
 * page, or a wider screen, and closes again, landing on the section, when one
 * of its links or its Free Quote button is chosen, but not when a link opens
 * in a new tab; the contact form refuses to send without its required fields
 * and reports Netlify's answer honestly, clearing its error on a retry and
 * coming back after the thank-you message, with Netlify's side faked in the
 * browser so nothing is really sent; and the 404 page answers an unknown
 * address with its own heading, title, and noindex tag and leads back to the
 * home page and its sections, as does an address that names a section
 * directly. Pages open under reduced motion, so scrolling jumps straight to
 * its target and each position can be read at once; how things move is checked
 * elsewhere.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const CLI_KIN_ARR : Array< [ string, Parameters< Locator[ 'click' ] >[ 0 ] ] > = [ [ 'Ctrl or Cmd', { modifiers : [ 'ControlOrMeta' ] } ], [ 'middle', { button : 'middle' } ] ]; // What: Click Kind Array. Why: Both ways of asking for a new tab have to keep working now that plain clicks scroll in place. How: Each row pairs a click kind's name with the click options that make it, ControlOrMeta pressing Cmd on a Mac and Ctrl elsewhere.

const DES_VIE_OBJ = { height : 900, width : 1440 }; // What: Desktop Viewport Object. Why: The bar's own links show only on wide screens. How: This is the desktop size the navigation checks use.
const PHO_VIE_OBJ = { height : 844, width : 390  }; // What: Phone Viewport Object. Why: The mobile menu exists only on small screens. How: This is the phone size the menu checks use.

// #endregion Constants



// #region Helpers

// #region opeMenFun

/**
 * opeMenFun = Open Menu Function
 *
 * @summary
 * Opens the mobile menu through its button and waits until the button
 * reports it open, so a menu check always starts from the menu showing. The
 * caller has to be on a phone-sized viewport, where the button exists.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page whose menu to open.
 *
 * @returns A promise that settles once the menu reports itself open, with no
 *          value.
 *
 * @example
 * ```ts
 * opeMenFun(page) // => Promise<void>
 * ```
 *
*/

async function opeMenFun ( curPagObj : Page ) : Promise< void > {


	const togButObj = curPagObj.getByRole( 'button', { name : 'Toggle menu' } ); // What: Toggle Button Object. Why: The menu opens from its button. How: This finds the button by its name.


	await togButObj.click(); // What: Toggle Click Call. Why: The menu opens from a tap on the button. How: This clicks it.

	await expect( togButObj ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Menu Open Wait. Why: A check should start with the menu open. How: This waits until the button reports it expanded.


}

// #endregion opeMenFun



// #region opeRouFun

/**
 * opeRouFun = Open Route Function
 *
 * @summary
 * Opens one route at one viewport size, ready to be used: it turns on
 * reduced motion so in-page scrolling jumps rather than glides, sizes the
 * viewport, loads the path, and waits for the web fonts, so positions read
 * afterwards are final.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open the route on.
 * @param rouPatStr - Route Path String: The route to load.
 * @param vieSizObj - Viewport Size Object: {@link DES_VIE_OBJ} or
 *                    {@link PHO_VIE_OBJ}.
 *
 * @returns A promise that settles once the route has loaded at its viewport
 *          size, with no value.
 *
 * @example
 * ```ts
 * opeRouFun(page, '/', DES_VIE_OBJ) // => Promise<void>
 * ```
 *
*/

async function opeRouFun ( curPagObj : Page, rouPatStr : string, vieSizObj : { height : number, width : number } ) : Promise< void > {


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Scrolling should land at once, so its target can be read right away. How: This makes the page match prefers-reduced-motion, which turns smooth scrolling off.

	await curPagObj.setViewportSize( vieSizObj ); // What: Viewport Size Call. Why: The bar's links and the menu depend on the width. How: This sizes the page before it loads.

	await curPagObj.goto( rouPatStr ); // What: Route Load Call. Why: Each check starts from a fresh load. How: This opens the path on the suite's dev server.

	await curPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Positions measured before the fonts load would shift. How: This waits until every font face has loaded.


}

// #endregion opeRouFun



// #region secTopFun

/**
 * secTopFun = Section Top Function
 *
 * @summary
 * Reads how far an element's top edge sits below the top of the viewport,
 * in pixels, so a check can tell whether a link scrolled its section to the
 * top of the screen. Zero means the section starts right at the top. An
 * element that isn't on the page yet reads as infinitely far away, so a
 * polling check keeps waiting for it rather than failing outright.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to measure.
 * @param secIdeStr - Section Identifier String: The id of the element to
 *                    measure.
 *
 * @returns A promise that resolves with the element's top edge, in pixels from
 *          the viewport's top.
 *
 * @example
 * ```ts
 * secTopFun(page, 'services') // => 0
 * ```
 *
*/

async function secTopFun ( curPagObj : Page, secIdeStr : string ) : Promise< number > {


	return curPagObj.evaluate( ( tarIdeStr ) => document.getElementById( tarIdeStr )?.getBoundingClientRect().top ?? Infinity, secIdeStr ); // What: Section Top Return. Why: A check compares where the section landed with the top of the screen. How: This reads the element's top edge inside the page, or Infinity while it isn't there yet.


}

// #endregion secTopFun



// #region ariSecFun

/**
 * ariSecFun = Arrival Section Function
 *
 * @summary
 * Waits until the visitor has landed on a home page section: the address is
 * the bare root, with no hash left in it, and the section's top edge sits less
 * than 2 pixels from the top of the screen. Both are polled, since a link from
 * another page renders the home page and scrolls a moment after the click.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to check.
 * @param secIdeStr - Section Identifier String: The id of the section the
 *                    visitor should land on.
 *
 * @returns A promise that settles once the visitor has landed on the section
 *          with a clean address, with no value.
 *
 * @example
 * ```ts
 * ariSecFun(page, 'contact') // => Promise<void>
 * ```
 *
*/

async function ariSecFun ( curPagObj : Page, secIdeStr : string ) : Promise< void > {


	await expect( curPagObj ).toHaveURL( /^[^#]*\/$/ );                                                     // What: Clean Address Assertion. Why: Section links keep the address free of hashes, even when they come from another page. How: This waits until the URL is the bare root.
	await expect.poll( async () => Math.abs( await secTopFun( curPagObj, secIdeStr ) ) ).toBeLessThan( 2 ); // What: Section Position Assertion. Why: The visitor should land on the section they chose. How: This waits until its top edge sits less than 2 pixels from the viewport's top.


}

// #endregion ariSecFun

// #endregion Helpers



// #region Module Init

// #region Home Page Navigation Checks

for ( const [ linLabStr, secIdeStr ] of [ [ 'Home', 'home' ], [ 'Services', 'services' ], [ 'About', 'about' ], [ 'Contact', 'contact' ] ] ) { // What: Section Link Loop. Why: Each of the bar's section links has its own target. How: This declares one test per link, pairing its label with its section's id.


	test( `the ${ linLabStr } link scrolls to its section`, async ( { page : curPagObj } ) => { // What: Section Link Test. Why: A section link has to take the visitor to its section. How: This clicks the link and checks the address and the section's position.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's own links show on wide screens. How: This opens the home page at desktop size.

		await curPagObj.evaluate( () => window.scrollTo( { behavior : 'instant', top : 1200 } ) ); // What: Scroll Down Call. Why: The Home link has to be seen bringing a scrolled visitor back, and every other link reaching its section from mid-page. How: This jumps a way down the page first.

		await curPagObj.getByRole( 'navigation', { name : 'Main' } ).getByRole( 'link', { exact : true, name : linLabStr } ).click(); // What: Section Link Click Call. Why: This is the action under test. How: This clicks the bar's link by its label.

		await ariSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


	} );


}



test( 'the brand returns to the top', async ( { page : curPagObj } ) => { // What: Brand Link Test. Why: The brand doubles as the way back to the top. How: This scrolls down, clicks the brand, and checks the page is back at the top with a clean address.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The brand is checked on the home page. How: This opens it at desktop size.

	await curPagObj.evaluate( () => window.scrollTo( 0, 2000 ) ); // What: Scroll Down Call. Why: Returning to the top only shows once the page has left it. How: This scrolls well down the page.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { name : 'Seal and Shield' } ).click(); // What: Brand Click Call. Why: This is the action under test. How: This clicks the bar's brand.

	await ariSecFun( curPagObj, 'home' ); // What: Top Arrival Check. Why: The hero is the top of the page. How: This waits for it to sit at the top with a clean address.


} );



for ( const [ cliKinStr, cliOptObj ] of CLI_KIN_ARR ) { // What: Modified Click Loop. Why: Each way of asking for a new tab gets its own check. How: This declares one test per row of CLI_KIN_ARR.


	test( `a ${ cliKinStr } click opens a section in a new tab`, async ( { page : curPagObj } ) => { // What: New Tab Test. Why: A visitor opening a section in a new tab should land on it there, and the page they clicked from should stay put. How: This makes the click, then checks the new tab's section and address and the old page's scroll and address.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's own links show on wide screens. How: This opens the home page at desktop size.


		const newTabPro = curPagObj.context().waitForEvent( 'page' ); // What: New Tab Promise. Why: The click opens its page in a new tab. How: This waits for the browser context to report a new page, set up before the click so it can't be missed.


		await curPagObj.getByRole( 'navigation', { name : 'Main' } ).getByRole( 'link', { exact : true, name : 'About' } ).click( cliOptObj ); // What: Modified Click Call. Why: This is the action under test. How: This clicks the bar's About link the way the loop's row says.


		const newTabObj = await newTabPro; // What: New Tab Object. Why: The section should open in the new tab. How: This is the page the click opened.


		await expect( newTabObj.locator( '#about' ) ).toBeVisible();                                          // What: Section Render Wait. Why: The new tab loads the page from scratch, so the section has to exist before it's measured. How: This waits until the About section is on the page.
		await expect.poll( async () => Math.abs( await secTopFun( newTabObj, 'about' ) ) ).toBeLessThan( 2 ); // What: New Tab Position Assertion. Why: The new tab should land on the section. How: This waits until the About section's top edge sits less than 2 pixels from the viewport's top.
		await expect( newTabObj ).toHaveURL( /\/$/ );                                                         // What: New Tab Address Assertion. Why: The new tab's hash should be cleared once used. How: This checks its URL ends at the root.
		expect( await curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 );                                 // What: Original Scroll Assertion. Why: The page clicked from should stay where it was. How: This checks it's still at the top.
		await expect( curPagObj ).toHaveURL( /\/$/ );                                                         // What: Original Address Assertion. Why: The page clicked from shouldn't navigate. How: This checks its URL still ends at the root.


	} );


}



for ( const [ linLabStr, secIdeStr ] of [ [ 'Home', 'home' ], [ 'Services', 'services' ], [ 'About', 'about' ], [ 'Contact', 'contact' ] ] ) { // What: Footer Link Loop. Why: Each of the footer's section links is the way onward from the bottom of the page. How: This declares one test per link, pairing its label with its section's id.


	test( `the footer's ${ linLabStr } link scrolls to its section`, async ( { page : curPagObj } ) => { // What: Footer Link Test. Why: A footer link has to take the visitor to its section. How: This clicks the link from the bottom of the page and checks where the visitor lands.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The footer is checked on the home page first. How: This opens it at desktop size.

		await curPagObj.getByRole( 'navigation', { name : 'Footer' } ).getByRole( 'link', { name : linLabStr } ).click(); // What: Footer Link Click Call. Why: This is the action under test. How: This clicks the footer link labelled by the loop's label, which scrolls the page down to reach it.

		await ariSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


	} );


}



for ( const [ butLabStr, secIdeStr ] of [ [ 'Get a Free Quote', 'contact' ], [ 'Our Services', 'services' ] ] ) { // What: Hero Button Loop. Why: Each of the hero's buttons is a section link of its own. How: This declares one test per button, pairing its label with its section's id.


	test( `the hero's ${ butLabStr } button scrolls to its section`, async ( { page : curPagObj } ) => { // What: Hero Button Test. Why: The hero's buttons are the page's first way onward. How: This clicks the button and checks where the visitor lands.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The hero opens the home page. How: This opens it at desktop size.

		await curPagObj.getByRole( 'main' ).getByRole( 'link', { exact : true, name : butLabStr } ).click(); // What: Hero Button Click Call. Why: This is the action under test. How: This clicks the button by its label inside the main content.

		await ariSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


	} );


}

// #endregion Home Page Navigation Checks



// #region Skip Link Checks

for ( const [ pagNamStr, rouPatStr ] of [ [ 'home page', '/' ], [ '404 page', '/no-such-page' ] ] ) { // What: Skip Link Loop. Why: Every page opens with the skip link. How: This declares one check per page.


	test( `the first Tab on the ${ pagNamStr } reaches the skip link, which moves focus to the main content`, async ( { browserName : broNamStr, page : curPagObj } ) => { // What: Skip Link Test. Why: A keyboard user has to be able to jump past the bar. How: This presses Tab once, checks the skip link holds focus on screen, then clicks it and checks focus moved to the main element with a clean address.


		const skiLinLoc = curPagObj.getByRole( 'link', { name : 'Skip to main content' } ); // What: Skip Link Locator. Why: Each step below reaches the same link. How: This finds it by its role and name.



		await opeRouFun( curPagObj, rouPatStr, DES_VIE_OBJ ); // What: Page Open Call. Why: The skip link is checked on each page. How: This opens the page at desktop size.

		await curPagObj.keyboard.press( broNamStr === 'webkit' ? 'Alt+Tab' : 'Tab' ); // What: First Tab Call. Why: The skip link should be the page's first stop. How: This presses Tab, or Alt+Tab in WebKit, whose plain Tab skips links the way Safari does by default.

		await expect( skiLinLoc ).toBeFocused();    // What: Skip Focus Assertion. Why: The skip link has to be the page's first stop. How: This checks it holds focus after the first Tab.
		await expect( skiLinLoc ).toBeInViewport(); // What: Skip Shown Assertion. Why: A focused link waiting above the screen would leave a keyboard user lost. How: This checks it has slid into view.

		await skiLinLoc.click(); // What: Skip Click Call. Why: This is the action under test. How: This clicks the focused skip link.

		await expect( curPagObj.locator( 'main' ) ).toBeFocused();              // What: Main Focus Assertion. Why: The jump has to land past the bar, so the next Tab continues into the content. How: This checks the main element holds focus.
		await expect( curPagObj ).toHaveURL( new RegExp( `${ rouPatStr }$` ) ); // What: Clean Address Assertion. Why: The jump shouldn't leave a hash in the address. How: This checks the address still ends with the page's own path.


	} );


}

// #endregion Skip Link Checks



// #region Mobile Menu Checks

test( 'the menu button opens and closes the menu', async ( { page : curPagObj } ) => { // What: Menu Toggle Test. Why: The menu button is the bar's only way to the section links on a phone, where the bar's own row is hidden. How: This opens the menu, checks its Services link shows and the page behind it is inert, then closes it again and checks the button reports it collapsed and the page is no longer inert.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Phone Open Call. Why: The menu button shows only on small screens. How: This opens the home page at phone size.

	await opeMenFun( curPagObj ); // What: Menu Open Call. Why: The open state comes first. How: This opens the menu through its button.

	await expect( curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'Services' } ) ).toBeVisible(); // What: Menu Link Assertion. Why: An open menu should show its links. How: This checks the bar's Services link is visible, the menu's own at phone size, since the bar's row is hidden there.
	await expect( curPagObj.locator( 'main' ) ).toHaveAttribute( 'inert', '' );                                             // What: Inert Page Assertion. Why: The page under the dimmer shouldn't take focus. How: This checks the main content is inert while the menu is open.

	await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); // What: Close Click Call. Why: The same button closes the menu. How: This clicks it again.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The menu should be closed and say so. How: This checks the button reports it collapsed.
	await expect( curPagObj.locator( 'main' ) ).not.toHaveAttribute( 'inert' );                                            // What: Live Page Assertion. Why: The page has to be usable again. How: This checks the main content is no longer inert.


} );



test( 'Escape closes the menu and returns focus to its button', async ( { page : curPagObj } ) => { // What: Escape Test. Why: Escape is the expected way out of a layer over the page. How: This opens the menu, presses Escape, and checks the menu and focus.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Phone Open Call. Why: The menu exists only on small screens. How: This opens the home page at phone size.

	await opeMenFun( curPagObj ); // What: Menu Open Call. Why: Escape only matters with the menu open. How: This opens it.

	await curPagObj.keyboard.press( 'Escape' ); // What: Escape Press Call. Why: This is the action under test. How: This presses Escape.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Menu Closed Assertion. Why: Escape should close the menu. How: This checks the button reports it collapsed.
	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toBeFocused();                               // What: Button Focus Assertion. Why: Focus shouldn't be left inside the closed menu. How: This checks it moved to the menu button.


} );



test( 'a tap on the dimmed page closes the menu', async ( { page : curPagObj } ) => { // What: Scrim Test. Why: Tapping outside the menu is a natural way to dismiss it. How: This opens the menu, taps near the bottom of the screen, and checks it closed.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Phone Open Call. Why: The menu exists only on small screens. How: This opens the home page at phone size.

	await opeMenFun( curPagObj ); // What: Menu Open Call. Why: The dimmer shows only while the menu is open. How: This opens it.

	await curPagObj.mouse.click( 195, 820 ); // What: Scrim Tap Call. Why: This is the action under test. How: This clicks near the bottom middle of the screen, below the menu, where only the dimmer sits.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Menu Closed Assertion. Why: The tap should close the menu. How: This checks the button reports it collapsed.


} );



for ( const [ linLabStr, secIdeStr ] of [ [ 'Home', 'home' ], [ 'Services', 'services' ], [ 'About', 'about' ], [ 'Contact', 'contact' ], [ 'Free Quote', 'contact' ] ] ) { // What: Menu Link Loop. Why: Each of the menu's section links, and its quote button, leads to its own section. How: This declares one test per link, pairing its label with its section's id.


	test( `the menu's ${ linLabStr } link closes the menu and scrolls to its section`, async ( { page : curPagObj } ) => { // What: Menu Link Test. Why: Choosing a section should both take the visitor there and get the menu out of the way. How: This opens the menu, clicks the link, and checks the menu, the section, and the address.


		await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Phone Open Call. Why: The menu exists only on small screens. How: This opens the home page at phone size.

		await curPagObj.evaluate( () => window.scrollTo( { behavior : 'instant', top : 1200 } ) ); // What: Scroll Down Call. Why: The Home link has to be seen bringing a scrolled visitor back, and every other link reaching its section from mid-page. How: This jumps a way down the page first.

		await opeMenFun( curPagObj ); // What: Menu Open Call. Why: The menu's links show only while it's open. How: This opens it.

		await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : linLabStr } ).click(); // What: Menu Link Click Call. Why: This is the action under test. How: This clicks the link by its label, the only one visible at phone size, since the bar's own links are hidden there.

		await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Menu Closed Assertion. Why: The menu should close once a section is chosen. How: This checks the button reports it collapsed.

		await ariSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


	} );


}



test( 'a new tab click on a menu link leaves the menu open', async ( { page : curPagObj } ) => { // What: Menu New Tab Test. Why: A link opened in a new tab hasn't taken the visitor anywhere, so the menu should stay as it was. How: This clicks a menu link with Ctrl or Cmd held and checks the new tab and the menu.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Phone Open Call. Why: The menu exists only on small screens. How: This opens the home page at phone size.

	await opeMenFun( curPagObj ); // What: Menu Open Call. Why: The menu's links show only while it's open. How: This opens it.


	const newTabPro = curPagObj.context().waitForEvent( 'page' ); // What: New Tab Promise. Why: The click opens its page in a new tab. How: This waits for the browser context to report a new page, set up before the click so it can't be missed.


	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { exact : true, name : 'About' } ).click( { modifiers : [ 'ControlOrMeta' ] } ); // What: Modified Click Call. Why: This is the action under test. How: This clicks the menu's About link with Cmd on a Mac and Ctrl elsewhere.

	await newTabPro; // What: New Tab Wait. Why: The click should still open the link in a new tab. How: This waits for the new page to appear.

	await expect( curPagObj.getByRole( 'button', { name : 'Toggle menu' } ) ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Menu Open Assertion. Why: The menu should stay open on the page clicked from. How: This checks the button still reports it expanded.


} );



test( 'widening the screen closes the menu', async ( { page : curPagObj } ) => { // What: Widen Test. Why: Past the breakpoint the menu button disappears, so an open menu would leave the page inert with no way out. How: This opens the menu, widens the viewport, and checks the page is usable again.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Phone Open Call. Why: The menu exists only on small screens. How: This opens the home page at phone size.

	await opeMenFun( curPagObj ); // What: Menu Open Call. Why: Widening only matters with the menu open. How: This opens it.

	await curPagObj.setViewportSize( DES_VIE_OBJ ); // What: Widen Call. Why: This is the action under test. How: This resizes the viewport to desktop size.

	await expect( curPagObj.locator( 'main' ) ).not.toHaveAttribute( 'inert' ); // What: Live Page Assertion. Why: The page has to stay usable once the menu button is gone. How: This checks the main content is no longer inert.


} );

// #endregion Mobile Menu Checks



// #region Contact Form Checks

test( "the form won't send without its required fields", async ( { page : curPagObj } ) => { // What: Required Fields Test. Why: A quote request without a name and phone number can't be answered. How: This submits the empty form and checks the name field reports its value missing and nothing was sent.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form lives in the Contact section. How: This opens the home page at desktop size.


	const posCouObj = await fakNetFun( curPagObj, 200 ); // What: Post Count Object. Why: The check has to know whether anything was sent. How: This fakes Netlify and counts the posts.


	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Empty Submit Click Call. Why: This is the action under test. How: This clicks Submit with every field empty.

	await expect( curPagObj.getByLabel( 'Full Name *' ) ).toHaveJSProperty( 'validity.valueMissing', true ); // What: Name Missing Assertion. Why: The browser should hold the form back for the empty name. How: This checks the field reports its required value missing.
	expect( posCouObj.couNum ).toBe( 0 );                                                                    // What: Nothing Sent Assertion. Why: An incomplete request mustn't reach Netlify. How: This checks no post was made.


} );



test( 'a sent request shows the thank-you message', async ( { page : curPagObj } ) => { // What: Sent Request Test. Why: The visitor should see their request arrived only once Netlify accepts it. How: This sends a complete request against a faked OK answer and checks the message appears and exactly one post was made.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form lives in the Contact section. How: This opens the home page at desktop size.


	const posCouObj = await fakNetFun( curPagObj, 200 ); // What: Post Count Object. Why: The request should be sent exactly once. How: This fakes an OK answer from Netlify and counts the posts.


	await curPagObj.getByLabel( 'Full Name *' ).fill( 'Test Visitor' ); // What: Name Fill Call. Why: The name is required. How: This types a name.
	await curPagObj.getByLabel( 'Phone *' ).fill( '(785) 555-0100' );   // What: Phone Fill Call. Why: The phone number is required. How: This types a number from the reserved 555-01xx range.

	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Submit Click Call. Why: This is the action under test. How: This sends the request.

	await expect( curPagObj.getByRole( 'heading', { name : 'Message Sent!' } ) ).toBeVisible(); // What: Thank-You Assertion. Why: An accepted request should say so. How: This checks the thank-you heading appears.
	expect( posCouObj.couNum ).toBe( 1 );                                                       // What: Single Send Assertion. Why: One request should reach Netlify once. How: This checks exactly one post was made.


} );



test( 'a failed request explains what to do instead', async ( { page : curPagObj } ) => { // What: Failed Request Test. Why: A request Netlify rejects mustn't look sent. How: This sends a complete request against a faked error and checks the error message appears and the thank-you message never does.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form lives in the Contact section. How: This opens the home page at desktop size.

	await fakNetFun( curPagObj, 500 ); // What: Netlify Error Fake Call. Why: The form has to handle Netlify turning a request down. How: This answers every post to the site's root with a server error.

	await curPagObj.getByLabel( 'Full Name *' ).fill( 'Test Visitor' ); // What: Name Fill Call. Why: The name is required. How: This types a name.
	await curPagObj.getByLabel( 'Phone *' ).fill( '(785) 555-0100' );   // What: Phone Fill Call. Why: The phone number is required. How: This types a number from the reserved 555-01xx range.

	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Submit Click Call. Why: This is the action under test. How: This sends the request.

	await expect( curPagObj.getByRole( 'alert' ) ).toContainText( "didn't go through" );           // What: Error Message Assertion. Why: The visitor should know the request failed and what to do next. How: This checks the alert appears with its explanation.
	await expect( curPagObj.getByRole( 'heading', { name : 'Message Sent!' } ) ).toHaveCount( 0 ); // What: No Thank-You Assertion. Why: A failed request mustn't claim it was sent. How: This checks the thank-you heading never appears.


} );



test( 'a retry after a failure clears the error and sends', async ( { page : curPagObj } ) => { // What: Retry Test. Why: The error should fade out once the visitor tries again, and a successful retry should say so. How: This fails one request, lets the next one through, and checks the error leaves as the thank-you arrives.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form lives in the Contact section. How: This opens the home page at desktop size.

	await fakNetFun( curPagObj, 500 ); // What: Netlify Error Fake Call. Why: The first attempt has to fail. How: This answers every post to the site's root with a server error.

	await curPagObj.getByLabel( 'Full Name *' ).fill( 'Test Visitor' ); // What: Name Fill Call. Why: The name is required. How: This types a name.
	await curPagObj.getByLabel( 'Phone *' ).fill( '(785) 555-0100' );   // What: Phone Fill Call. Why: The phone number is required. How: This types a number from the reserved 555-01xx range.

	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: First Submit Click Call. Why: The first attempt shows the error. How: This sends the request.

	await expect( curPagObj.getByRole( 'alert' ) ).toBeVisible(); // What: Error Shown Wait. Why: The retry only matters once the error is up. How: This waits for the alert.

	await fakNetFun( curPagObj, 200 ); // What: Netlify Success Fake Call. Why: The retry should go through. How: This adds a route answering OK, which Playwright tries before the earlier one.

	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Retry Click Call. Why: This is the action under test. How: This sends the request again.

	await expect( curPagObj.getByRole( 'heading', { name : 'Message Sent!' } ) ).toBeVisible(); // What: Thank-You Assertion. Why: An accepted retry should say so. How: This checks the thank-you heading appears.
	await expect( curPagObj.getByRole( 'alert' ) ).toHaveCount( 0 );                            // What: Error Gone Assertion. Why: The error should leave once the visitor tries again. How: This checks the alert is gone.


} );



test( 'the form comes back after the thank-you message', async ( { page : curPagObj } ) => { // What: Form Return Test. Why: A visitor may want to send another request, so the thank-you gives way to the form once the message has faded out. How: This sends a request, moves the clock six seconds ahead, and checks the form is back and the thank-you message is gone.


	await curPagObj.clock.install(); // What: Clock Install Call. Why: Waiting six real seconds would slow the suite. How: This puts the page's timers under the test's control before it loads.

	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form lives in the Contact section. How: This opens the home page at desktop size.

	await fakNetFun( curPagObj, 200 ); // What: Netlify OK Fake Call. Why: The request has to be accepted for the thank-you to show. How: This fakes an OK answer.

	await curPagObj.getByLabel( 'Full Name *' ).fill( 'Test Visitor' ); // What: Name Fill Call. Why: The name is required. How: This types a name.
	await curPagObj.getByLabel( 'Phone *' ).fill( '(785) 555-0100' );   // What: Phone Fill Call. Why: The phone number is required. How: This types a number from the reserved 555-01xx range.

	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Submit Click Call. Why: The thank-you only shows once a request is sent. How: This sends the request.

	await expect( curPagObj.getByRole( 'heading', { name : 'Message Sent!' } ) ).toBeVisible(); // What: Thank-You Wait. Why: The return is timed from the thank-you. How: This waits for it to appear.

	await curPagObj.clock.fastForward( 6000 ); // What: Clock Fast Forward Call. Why: This is the wait under test. How: This runs the page's timers six seconds ahead, which starts the message's exit.

	await expect( curPagObj.getByRole( 'heading', { name : 'Free Quote Request' } ) ).toBeVisible(); // What: Form Back Assertion. Why: The form should return once the message has faded out. How: This checks the form's heading is showing again.
	await expect( curPagObj.getByRole( 'heading', { name : 'Message Sent!' } ) ).toHaveCount( 0 );   // What: Thank-You Gone Assertion. Why: The message should leave as the form returns. How: This checks it's gone.


} );

// #endregion Contact Form Checks



// #region Not Found Checks

test( 'an unknown address shows the 404 page', async ( { page : curPagObj } ) => { // What: Not Found Test. Why: A mistyped or outdated address should land somewhere useful and stay out of search results. How: This opens an address the site doesn't have and checks the heading, title, and robots tag.


	await opeRouFun( curPagObj, '/no-such-page', DES_VIE_OBJ ); // What: Unknown Address Open Call. Why: Any unknown path should reach the 404 page. How: This opens one.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveText( 'Page Not Found.' );    // What: Not Found Heading Assertion. Why: The page should say plainly what happened. How: This checks its heading.
	await expect( curPagObj ).toHaveTitle( 'Page Not Found | Seal and Shield' );                        // What: Not Found Title Assertion. Why: The tab should name the problem too. How: This checks the page's own title.
	await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveAttribute( 'content', 'noindex' ); // What: Noindex Assertion. Why: The host answers every unknown path with a 200, so search engines must be told not to index it. How: This checks the robots tag.


} );



test( 'Return Home leads to the home page', async ( { page : curPagObj } ) => { // What: Return Home Test. Why: The 404 page's main action has to work. How: This clicks Return Home and checks the address, title, and robots tag.


	await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: Return Home lives on the 404 page. How: This opens it.

	await curPagObj.getByRole( 'link', { name : 'Return Home' } ).click(); // What: Return Home Click Call. Why: This is the action under test. How: This clicks the button.

	await expect( curPagObj ).toHaveURL( /^[^#]*\/$/ );                                             // What: Home Address Assertion. Why: The visitor should land on the home page. How: This checks the URL is the bare root.
	await expect( curPagObj ).not.toHaveTitle( 'Page Not Found | Seal and Shield' );                // What: Home Title Assertion. Why: The 404 page's title should give way to the home page's. How: This checks the title changed back.
	await expect( curPagObj.locator( 'meta[name="robots"][content="noindex"]' ) ).toHaveCount( 0 ); // What: Noindex Removed Assertion. Why: The home page must stay indexable after a visit to the 404 page. How: This checks the noindex tag left with the page.


} );



for ( const [ conLabStr, secIdeStr, locKeyStr, conDesStr ] of [ [ 'Get a Free Quote', 'contact', 'main', 'Get a Free Quote button' ], [ 'About', 'about', 'bar', 'About link in the bar' ], [ 'Services', 'services', 'footer', 'Services link in the footer' ] ] ) { // What: Way Home Loop. Why: The 404 page's own quote button, the bar's links, and the footer's links all have to reach their home page sections from it. How: This declares one test per kind of control, naming where to find it and how its title describes it.


	test( `the 404 page's ${ conDesStr } leads to its section`, async ( { page : curPagObj } ) => { // What: Not Found Section Test. Why: A section control on the 404 page has no section to scroll to, so it has to go home first. How: This clicks it and checks where the visitor lands.


		await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: These controls are checked from the 404 page. How: This opens it.


		const conLocObj = locKeyStr === 'main' // What: Control Locator Object. Why: Each kind of control lives in a different part of the page. How: This finds the quote link in the page's content, the link in the bar, or the link in the footer.
			? curPagObj.getByRole( 'main' ).getByRole( 'link', { name : conLabStr } )                                 // What: Quote Link Locator. Why: The page's own button is in its main content. How: This finds it by its label.
			: locKeyStr === 'bar'                                                                                     // What: Bar Check. Why: The bar's links and the footer's sit in different navigation landmarks. How: This picks the bar's link next.
				? curPagObj.getByRole( 'navigation', { name : 'Main' } ).getByRole( 'link', { name : conLabStr } )    // What: Bar Link Locator. Why: The bar holds its own section links. How: This finds one by its label.
				: curPagObj.getByRole( 'navigation', { name : 'Footer' } ).getByRole( 'link', { name : conLabStr } ); // What: Footer Link Locator. Why: The footer's section controls are links too. How: This finds one by its label.


		await conLocObj.click(); // What: Control Click Call. Why: This is the action under test. How: This clicks the control.

		await ariSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the home page's section with a clean address. How: This waits for both.


	} );


}



test( 'an address naming a section opens there', async ( { page : curPagObj } ) => { // What: Section Address Test. Why: A shared or bookmarked address with a hash, such as one the 404 page links to, should still land on its section. How: This loads /#about directly and checks where the visitor lands.


	await opeRouFun( curPagObj, '/#about', DES_VIE_OBJ ); // What: Section Address Open Call. Why: This is the action under test. How: This loads the home page with the About section's hash.

	await ariSecFun( curPagObj, 'about' ); // What: About Arrival Check. Why: The visitor should land on About, and the hash should leave the address. How: This waits for both.


} );

// #endregion Not Found Checks

// #endregion Module Init


