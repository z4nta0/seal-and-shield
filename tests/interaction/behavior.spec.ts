


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each behavior passes only when the page ends up where it should. How: This asserts on URLs, attributes, text, and positions.
import { test   } from '@playwright/test'; // What: Test. Why: Each behavior is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: Every helper drives a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * behavior.spec.ts = Behavior Spec
 *
 * @summary
 * Checks what the site's controls actually do, in whichever engine the
 * project runs. The bar's section links, the brand, and the footer's
 * section buttons land on their sections and leave the address free of
 * hashes; the mobile menu opens, closes, and closes again when one of its
 * links is chosen; the contact form refuses to send without its required
 * fields and reports Netlify's answer honestly, with Netlify's side faked
 * in the browser so nothing is really sent; and the 404 page answers an
 * unknown address with a noindex tag and leads back to the home page and
 * its sections, as does an address that names a section directly. Pages
 * open under reduced motion, so scrolling jumps straight to its target and
 * each position can be read at once; how things move is checked elsewhere.
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

const DES_VIE_OBJ = { height : 900, width : 1440 }; // What: Desktop Viewport Object. Why: The bar's own links show only on wide screens. How: This is the desktop size the navigation checks use.
const PHO_VIE_OBJ = { height : 844, width : 390  }; // What: Phone Viewport Object. Why: The mobile menu exists only on small screens. How: This is the phone size the menu checks use.

// #endregion Constants



// #region Helpers

// #region fakNetFun

/**
 * fakNetFun = Fake Netlify Function
 *
 * @summary
 * Stands in for Netlify Forms during a form check: every post the page
 * makes to the site's root address is answered in the browser with the
 * given status instead of reaching the dev server, and counted, so a check
 * can tell whether the form sent anything at all. Every other request
 * passes through untouched.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page whose posts to answer.
 * @param staCodNum - Status Code Number: The HTTP status Netlify should
 *                    seem to answer with, e.g. 200 or 500.
 *
 * @returns An object whose couNum field counts the posts answered so far.
 * @see {@link posCouObj}
 *
 * @example
 * ```ts
 * fakNetFun(page, 200) // => { couNum : 0 }
 * ```
 *
*/

async function fakNetFun ( curPagObj : Page, staCodNum : number ) : Promise< { couNum : number } > {


	const posCouObj = { couNum : 0 }; // What: Post Count Object. Why: A check needs to know whether the form sent anything. How: This counts the posts the fake answers, read after the action.


	await curPagObj.route( ( reqUrlObj ) => reqUrlObj.pathname === '/', async ( curRouObj ) => { // What: Root Route Handler. Why: Netlify Forms takes the form's post at the site's root address. How: This intercepts every request to the root and answers only the posts.


		if ( curRouObj.request().method() !== 'POST' ) { await curRouObj.continue(); return; } // What: Page Load Pass Guard. Why: Loading the page itself also requests the root. How: This lets every request but a post through untouched.



		posCouObj.couNum += 1; // What: Post Count Increment. Why: The check reads how many posts were sent. How: This counts this one.

		await curRouObj.fulfill( { body : '', status : staCodNum } ); // What: Fake Answer Call. Why: The form should see Netlify's answer without anything really being sent. How: This answers the post with the given status and an empty body.


	} );



	return posCouObj; // What: Post Count Return. Why: Each test checks how many requests went out. How: This hands back the counter the route handler updates.


}

// #endregion fakNetFun



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
 * @returns The element's top edge, in pixels from the viewport's top.
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



// #region arrSecFun

/**
 * arrSecFun = Arrival Section Function
 *
 * @summary
 * Waits until the visitor has landed on a home page section: the address is
 * the bare root, with no hash left in it, and the section's top edge sits
 * within a pixel of the top of the screen. Both are polled, since a link
 * from another page renders the home page and scrolls a moment after the
 * click.
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
 * arrSecFun(page, 'contact') // => Promise<void>
 * ```
 *
*/

async function arrSecFun ( curPagObj : Page, secIdeStr : string ) : Promise< void > {


	await expect( curPagObj ).toHaveURL( /^[^#]*\/$/ ); // What: Clean Address Assertion. Why: Section links keep the address free of hashes, even when they come from another page. How: This waits until the URL is the bare root.

	await expect.poll( async () => Math.abs( await secTopFun( curPagObj, secIdeStr ) ) ).toBeLessThan( 2 ); // What: Section Position Assertion. Why: The visitor should land on the section they chose. How: This waits until its top edge sits within a pixel of the viewport's top.


}

// #endregion arrSecFun

// #endregion Helpers



// #region Module Init

// #region Home Page Navigation Checks

for ( const [ linLabStr, secIdeStr ] of [ [ 'Services', 'services' ], [ 'About', 'about' ], [ 'Contact', 'contact' ] ] ) { // What: Section Link Loop. Why: Each of the bar's section links has its own target. How: This declares one test per link, pairing its label with its section's id.


	test( `the ${ linLabStr } link scrolls to its section`, async ( { page : curPagObj } ) => { // What: Section Link Test. Why: A section link has to take the visitor to its section. How: This clicks the link and checks the address and the section's position.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's own links show on wide screens. How: This opens the home page at desktop size.

		await curPagObj.getByRole( 'navigation', { name : 'Main' } ).getByRole( 'link', { exact : true, name : linLabStr } ).click(); // What: Section Link Click Call. Why: This is the action under test. How: This clicks the bar's link by its label.


		await arrSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


	} );


}



test( 'the brand returns to the top', async ( { page : curPagObj } ) => { // What: Brand Link Test. Why: The brand doubles as the way back to the top. How: This scrolls down, clicks the brand, and checks the page is back at the top.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The brand is checked on the home page first. How: This opens it at desktop size.

	await curPagObj.evaluate( () => window.scrollTo( 0, 2000 ) ); // What: Scroll Down Call. Why: Returning to the top only shows once the page has left it. How: This scrolls well down the page.

	await curPagObj.getByRole( 'banner' ).getByRole( 'link', { name : 'Seal and Shield' } ).click(); // What: Brand Click Call. Why: This is the action under test. How: This clicks the bar's brand.


	await arrSecFun( curPagObj, 'home' ); // What: Top Arrival Check. Why: The hero is the top of the page. How: This waits for it to sit at the top with a clean address.


} );



test( 'a footer button scrolls to its section', async ( { page : curPagObj } ) => { // What: Footer Button Test. Why: The footer's section buttons are the way onward from the bottom of the page. How: This clicks the About button and checks where the visitor lands.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The footer is checked on the home page first. How: This opens it at desktop size.

	await curPagObj.getByRole( 'navigation', { name : 'Footer' } ).getByRole( 'button', { name : 'About' } ).click(); // What: Footer Button Click Call. Why: This is the action under test. How: This clicks the footer's About button.


	await arrSecFun( curPagObj, 'about' ); // What: About Arrival Check. Why: The visitor should land on the About section. How: This waits for it to sit at the top with a clean address.


} );

// #endregion Home Page Navigation Checks



// #region Mobile Menu Checks

test( 'the menu button opens and closes the menu', async ( { page : curPagObj } ) => { // What: Menu Toggle Test. Why: The menu button is the only way to the section links on a phone. How: This clicks it twice and checks the state it reports each time.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Phone Open Call. Why: The menu button shows only on small screens. How: This opens the home page at phone size.


	const togButObj = curPagObj.getByRole( 'button', { name : 'Toggle menu' } ); // What: Toggle Button Object. Why: The menu opens and closes from this button. How: This finds it by its name.


	await togButObj.click(); // What: Open Click Call. Why: The first tap should open the menu. How: This clicks the button.

	await expect( togButObj ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Open State Assertion. Why: The menu should be open and say so. How: This checks the button reports it expanded.

	await expect( curPagObj.getByRole( 'link', { exact : true, name : 'Services' } ) ).toBeVisible(); // What: Menu Link Assertion. Why: An open menu should show its links. How: This checks the Services link is visible.

	await togButObj.click(); // What: Close Click Call. Why: A second tap should close the menu. How: This clicks the button again.

	await expect( togButObj ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Closed State Assertion. Why: The menu should be closed and say so. How: This checks the button reports it collapsed.


} );



test( 'a menu link closes the menu and scrolls to its section', async ( { page : curPagObj } ) => { // What: Menu Link Test. Why: Choosing a section should both take the visitor there and get the menu out of the way. How: This opens the menu, clicks a link, and checks both.


	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Phone Open Call. Why: The menu exists only on small screens. How: This opens the home page at phone size.


	const togButObj = curPagObj.getByRole( 'button', { name : 'Toggle menu' } ); // What: Toggle Button Object. Why: The menu opens from this button, which also reports its state. How: This finds it by its name.


	await togButObj.click(); // What: Open Click Call. Why: The menu's links show only while it's open. How: This opens it.

	await curPagObj.getByRole( 'link', { name : 'Contact' } ).click(); // What: Menu Link Click Call. Why: This is the action under test. How: This clicks the menu's Contact link.


	await expect( togButObj ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Menu Closed Assertion. Why: The menu should close once a link is chosen. How: This checks the button reports it collapsed.

	await arrSecFun( curPagObj, 'contact' ); // What: Contact Arrival Check. Why: The visitor should land on the Contact section. How: This waits for it to sit at the top with a clean address.


} );

// #endregion Mobile Menu Checks



// #region Contact Form Checks

test( 'the form won\'t send without its required fields', async ( { page : curPagObj } ) => { // What: Required Fields Test. Why: A quote request without a name and phone number can't be answered. How: This submits the empty form and checks nothing was sent.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form lives in the Contact section. How: This opens the home page at desktop size.


	const posCouObj = await fakNetFun( curPagObj, 200 ); // What: Post Count Object. Why: The check has to know whether anything was sent. How: This fakes Netlify and counts the posts.


	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Empty Submit Click Call. Why: This is the action under test. How: This clicks Submit with every field empty.


	await expect( curPagObj.getByLabel( 'Full Name *' ) ).toHaveJSProperty( 'validity.valueMissing', true ); // What: Name Missing Assertion. Why: The browser should hold the form back for the empty name. How: This checks the field reports its required value missing.

	expect( posCouObj.couNum ).toBe( 0 ); // What: Nothing Sent Assertion. Why: An incomplete request mustn't reach Netlify. How: This checks no post was made.


} );



test( 'a sent request shows the thank-you message', async ( { page : curPagObj } ) => { // What: Sent Request Test. Why: The visitor should see their request arrived only once Netlify accepts it. How: This sends a complete request against a faked OK answer and checks the message.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form lives in the Contact section. How: This opens the home page at desktop size.


	const posCouObj = await fakNetFun( curPagObj, 200 ); // What: Post Count Object. Why: The request should be sent exactly once. How: This fakes an OK answer from Netlify and counts the posts.


	await curPagObj.getByLabel( 'Full Name *' ).fill( 'Test Visitor' ); // What: Name Fill Call. Why: The name is required. How: This types a name.

	await curPagObj.getByLabel( 'Phone *' ).fill( '(785) 555-0100' ); // What: Phone Fill Call. Why: The phone number is required. How: This types a number from the reserved 555-01xx range.

	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Submit Click Call. Why: This is the action under test. How: This sends the request.


	await expect( curPagObj.getByRole( 'heading', { name : 'Message Sent!' } ) ).toBeVisible(); // What: Thank-You Assertion. Why: An accepted request should say so. How: This checks the thank-you heading appears.

	expect( posCouObj.couNum ).toBe( 1 ); // What: Single Send Assertion. Why: One request should reach Netlify once. How: This checks exactly one post was made.


} );



test( 'a failed request explains what to do instead', async ( { page : curPagObj } ) => { // What: Failed Request Test. Why: A request Netlify rejects mustn't look sent. How: This sends a complete request against a faked error and checks the error message.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The form lives in the Contact section. How: This opens the home page at desktop size.

	await fakNetFun( curPagObj, 500 ); // What: Netlify Error Fake Call. Why: The form has to handle Netlify turning a request down. How: This answers every post with a server error.

	await curPagObj.getByLabel( 'Full Name *' ).fill( 'Test Visitor' ); // What: Name Fill Call. Why: The name is required. How: This types a name.

	await curPagObj.getByLabel( 'Phone *' ).fill( '(785) 555-0100' ); // What: Phone Fill Call. Why: The phone number is required. How: This types a number from the reserved 555-01xx range.

	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Submit Click Call. Why: This is the action under test. How: This sends the request.


	await expect( curPagObj.getByRole( 'alert' ) ).toContainText( 'didn\'t go through' ); // What: Error Message Assertion. Why: The visitor should know the request failed and what to do next. How: This checks the alert appears with its explanation.

	await expect( curPagObj.getByRole( 'heading', { name : 'Message Sent!' } ) ).toHaveCount( 0 ); // What: No Thank-You Assertion. Why: A failed request mustn't claim it was sent. How: This checks the thank-you heading never appears.


} );

// #endregion Contact Form Checks



// #region Not Found Checks

test( 'an unknown address shows the 404 page', async ( { page : curPagObj } ) => { // What: Not Found Test. Why: A mistyped or outdated address should land somewhere useful and stay out of search results. How: This opens an address the site doesn't have and checks the heading, title, and robots tag.


	await opeRouFun( curPagObj, '/no-such-page', DES_VIE_OBJ ); // What: Unknown Address Open Call. Why: Any unknown path should reach the 404 page. How: This opens one.


	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveText( 'Page Not Found.' ); // What: Not Found Heading Assertion. Why: The page should say plainly what happened. How: This checks its heading.

	await expect( curPagObj ).toHaveTitle( 'Page Not Found | Seal and Shield' ); // What: Not Found Title Assertion. Why: The tab should name the problem too. How: This checks the page's own title.

	await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveAttribute( 'content', 'noindex' ); // What: Noindex Assertion. Why: The host answers every unknown path with a 200, so search engines must be told not to index it. How: This checks the robots tag.


} );



test( 'Return Home leads to the home page', async ( { page : curPagObj } ) => { // What: Return Home Test. Why: The 404 page's main action has to work. How: This clicks Return Home and checks the address, title, and robots tag.


	await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: Return Home lives on the 404 page. How: This opens it.

	await curPagObj.getByRole( 'link', { name : 'Return Home' } ).click(); // What: Return Home Click Call. Why: This is the action under test. How: This clicks the button.


	await expect( curPagObj ).toHaveURL( /^[^#]*\/$/ ); // What: Home Address Assertion. Why: The visitor should land on the home page. How: This checks the URL is the bare root.

	await expect( curPagObj ).not.toHaveTitle( 'Page Not Found | Seal and Shield' ); // What: Home Title Assertion. Why: The 404 page's title should give way to the home page's. How: This checks the title changed back.

	await expect( curPagObj.locator( 'meta[name="robots"][content="noindex"]' ) ).toHaveCount( 0 ); // What: Noindex Removed Assertion. Why: The home page must stay indexable after a visit to the 404 page. How: This checks the noindex tag left with the page.


} );



for ( const [ conLabStr, secIdeStr, locKeyStr ] of [ [ 'Get a Free Quote', 'contact', 'main' ], [ 'About', 'about', 'bar' ], [ 'Services', 'services', 'footer' ] ] ) { // What: Way Home Loop. Why: The 404 page's own quote button, the bar's links, and the footer's buttons all have to reach their home page sections from it. How: This declares one test per kind of control, naming where to find it.


	test( `the 404 page's ${ locKeyStr } ${ conLabStr } control leads to its section`, async ( { page : curPagObj } ) => { // What: Not Found Section Test. Why: A section control on the 404 page has no section to scroll to, so it has to go home first. How: This clicks it and checks where the visitor lands.


		await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: These controls are checked from the 404 page. How: This opens it.


		const conLocObj = locKeyStr === 'main' // What: Control Locator Object. Why: Each kind of control lives in a different part of the page. How: This finds the quote link in the page's content, the link in the bar, or the button in the footer.
			? curPagObj.getByRole( 'main' ).getByRole( 'link', { name : conLabStr } )                                   // What: Quote Link Locator. Why: The page's own button is in its main content. How: This finds it by its label.
			: locKeyStr === 'bar'                                                                                    // What: Bar Check. Why: The bar and the footer hold different kinds of controls. How: This picks the bar's link next.
				? curPagObj.getByRole( 'navigation', { name : 'Main' } ).getByRole( 'link', { name : conLabStr } )      // What: Bar Link Locator. Why: The bar's section links are links. How: This finds one by its label.
				: curPagObj.getByRole( 'navigation', { name : 'Footer' } ).getByRole( 'button', { name : conLabStr } ); // What: Footer Button Locator. Why: The footer's section controls are buttons. How: This finds one by its label.


		await conLocObj.click(); // What: Control Click Call. Why: This is the action under test. How: This clicks the control.


		await arrSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the home page's section with a clean address. How: This waits for both.


	} );


}



test( 'an address naming a section opens there', async ( { page : curPagObj } ) => { // What: Section Address Test. Why: A shared or bookmarked address with a hash, such as one the 404 page links to, should still land on its section. How: This loads /#about directly and checks where the visitor lands.


	await opeRouFun( curPagObj, '/#about', DES_VIE_OBJ ); // What: Section Address Open Call. Why: This is the action under test. How: This loads the home page with the About section's hash.


	await arrSecFun( curPagObj, 'about' ); // What: About Arrival Check. Why: The visitor should land on About, and the hash should leave the address. How: This waits for both.


} );

// #endregion Not Found Checks

// #endregion Module Init


