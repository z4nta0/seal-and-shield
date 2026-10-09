


// #region Imports

import type { Page } from '@playwright/test'; // What: Page. Why: Opening a state drives a Playwright page. How: This types opeStaFun's page parameter.

// #endregion Imports



/**
 * states.ts = States
 *
 * @summary
 * The page states the accessibility and rendering suites visit, and the
 * helper that opens one; the responsive suite opens its own widths through
 * the same helper. A state is a page at a width, sometimes with something
 * opened on it: the home page at phone and desktop widths, and the mobile
 * menu open on a phone. opeStaFun sizes the viewport, loads the page, waits
 * for the fonts, scrolls through the page so its scroll-triggered content
 * fades in, runs the state's own action, such as opening the menu, and then
 * waits for the page to stay still so nothing is measured mid-fade.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type StaRcdTyp = { // What: State Record Type. Why: Every check reads the same description of a state. How: This names a state, its path, its viewport, and an optional action that opens something on it.


	actFun? : ( curPagObj : Page ) => Promise< void >, // What: Action Function. Why: Some states need something opened after the page loads. How: This runs against the loaded page, e.g. clicking the menu toggle.
	heiNum  : number,                                  // What: Height Number. Why: The viewport's height decides what's on screen. How: This is the viewport height in CSS pixels.
	ideStr  : string,                                  // What: Identifier String. Why: Each test names the state it checks. How: This becomes part of the test title.
	patStr  : string,                                  // What: Path String. Why: Each state opens one route. How: This is the path loaded from the dev server.
	widNum  : number                                   // What: Width Number. Why: Layouts and menus change with width. How: This is the viewport width in CSS pixels.


};

// #endregion Types



// #region Constants

// #region STA_RCD_ARR

/**
 * STA_RCD_ARR = State Record Array
 *
 * @summary
 * Every state the checks visit: the home page at a phone width (390px) and
 * a desktop width (1,440px), plus the mobile menu open at the phone width,
 * since the menu is only reachable there. Every row shares the
 * {@link StaRcdTyp} shape, so its fields carry no comments of their own:
 * - `actFun` (Function): Action Function, run after the page loads to open
 *   something on it, such as the menu. Only the menu row has one.
 * - `heiNum` (Number): Height Number, the viewport height in CSS pixels.
 * - `ideStr` (String): Identifier String, the state's name in test titles.
 * - `patStr` (String): Path String, the route loaded from the dev server.
 * - `widNum` (Number): Width Number, the viewport width in CSS pixels.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const STA_RCD_ARR : StaRcdTyp[] = [ // What: State Record Array. Why: Every check walks the same list of states, so a new state is added in one place. How: Each row names a state, its path, and its viewport, and the menu row adds the action that opens it.


	{ heiNum : 900, ideStr : 'home-desktop', patStr : '/', widNum : 1440 }, // What: Home Desktop State. Why: Most visitors on a computer land here. How: This loads the home page at 1,440px.
	{ heiNum : 844, ideStr : 'home-phone',   patStr : '/', widNum : 390  }, // What: Home Phone State. Why: The phone layout stacks every section and hides the bar's links behind the menu. How: This loads the home page at 390px.

	{ // What: Menu Phone State. Why: The open menu holds the phone's only copy of the section links and the phone number. How: This loads the home page at 390px and opens the menu through its toggle button.


		heiNum : 844,
		ideStr : 'menu-phone',
		patStr : '/',
		widNum : 390,

		actFun : async ( curPagObj ) => { await curPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); }


	}


];

// #endregion STA_RCD_ARR

// #endregion Constants



// #region Helpers

// #region revPagFun

/**
 * revPagFun = Reveal Page Function
 *
 * @summary
 * Scrolls the page from top to bottom half a screen at a time, the way a
 * visitor reading it would, then jumps back to the top. The home page's
 * sections fade their content in only once they scroll into view, so a page
 * that's never scrolled keeps most of its content invisible, and a full-page
 * screenshot or an axe scan would miss it. Each step pauses briefly so the
 * sections' scroll observers fire, and every jump is instant, overriding any
 * smooth scrolling the page asks for.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to scroll through.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * revPagFun(page) // => void
 * ```
 *
*/

async function revPagFun ( curPagObj : Page ) : Promise< void > {


	await curPagObj.evaluate( async () => { // What: Page Scroll Pass. Why: Content that fades in on scroll has to be scrolled to before it's checked. How: This steps down the page half a screen at a time, pausing at each step, then returns to the top.


		for ( let scrTopNum = 0; scrTopNum < document.documentElement.scrollHeight; scrTopNum += window.innerHeight / 2 ) { // What: Scroll Step Loop. Why: Every section has to enter the viewport at some point. How: This moves the scroll position down by half the viewport's height each pass until it passes the page's end.


			window.scrollTo( { behavior : 'instant', top : scrTopNum } ); // What: Scroll Step Call. Why: The next stretch of the page has to come into view. How: This jumps straight to the step's position, skipping any smooth scrolling.

			await new Promise( ( resFun ) => setTimeout( resFun, 100 ) ); // What: Step Pause Wait. Why: A section's scroll observer reports on its own schedule, not the moment the page moves. How: This waits 100ms before the next step.


		}



		window.scrollTo( { behavior : 'instant', top : 0 } ); // What: Scroll Reset Call. Why: Each state is checked from the top of the page, where a visitor arrives. How: This jumps back to the top.


	} );


}

// #endregion revPagFun



// #region waiSetFun

/**
 * waiSetFun = Wait Settled Function
 *
 * @summary
 * Waits until the page has stayed still for half a second: no animation or
 * transition running except ones that repeat forever, such as the hero
 * logo's pulsing ring, which never finish and so are skipped (the reduced
 * motion check is what catches one that shouldn't be playing). A single
 * still moment isn't enough, since the sections reveal their items on
 * staggered timers that can start a new fade up to about 100ms after the
 * last one ends, so the page has to read as still on five checks in a row,
 * 100ms apart. It fails after 5 seconds rather than hanging.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to wait on.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * waiSetFun(page) // => void
 * ```
 *
*/

async function waiSetFun ( curPagObj : Page ) : Promise< void > {


	const deaTimNum = Date.now() + 5000; // What: Deadline Time Number. Why: A page that never settles should fail rather than hang the run. How: This marks 5 seconds from now.

	let quiCouNum = 0; // What: Quiet Count Number. Why: The page has to stay still across several checks in a row. How: This counts consecutive still checks, starting from none.


	while ( quiCouNum < 5 ) { // What: Settle Check Loop. Why: The page counts as settled only after five still checks in a row. How: This keeps checking until the count reaches five.


		if ( Date.now() > deaTimNum ) throw new Error( 'The page was still animating after 5 seconds.' ); // What: Deadline Guard. Why: A page that keeps moving would otherwise loop forever. How: This fails the check once the deadline passes.



		const stiPagBoo = await curPagObj.evaluate( () => document.getAnimations().every( ( aniCurObj ) => aniCurObj.playState !== 'running' || aniCurObj.effect?.getComputedTiming().iterations === Infinity ) ); // What: Still Page Boolean. Why: Each check asks whether anything that ends is still moving. How: This is true when every running animation or transition is one that repeats forever.

		quiCouNum = stiPagBoo ? quiCouNum + 1 : 0; // What: Quiet Count Update. Why: Any movement restarts the count, so the page has to stay still the whole half second. How: This adds one for a still check and resets to zero otherwise.

		await curPagObj.waitForTimeout( 100 ); // What: Check Pause Wait. Why: The checks have to span time to prove the page stays still. How: This waits 100ms before the next one.


	}


}

// #endregion waiSetFun



// #region opeStaFun

/**
 * opeStaFun = Open State Function
 *
 * @summary
 * Opens one state on a page and waits until it's settled: sizes the
 * viewport, loads the path, waits for the web fonts, scrolls through the
 * page so every section's scroll-triggered content has faded in
 * ({@link revPagFun}), waits for every image to decode, runs the state's
 * action if it has one, then waits until the page stays still
 * ({@link waiSetFun}), so a check never measures a heading halfway through
 * its entrance fade or a menu halfway open.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open the state on.
 * @param staRcdObj - State Record Object: {@link StaRcdTyp}
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * opeStaFun(page, staRcdObj) // => void
 * ```
 *
*/

async function opeStaFun ( curPagObj : Page, staRcdObj : StaRcdTyp ) : Promise< void > {


	await curPagObj.setViewportSize( { height : staRcdObj.heiNum, width : staRcdObj.widNum } ); // What: Viewport Size Call. Why: The state's layout depends on its width. How: This sizes the page before it loads, so breakpoints apply from the first paint.

	await curPagObj.goto( staRcdObj.patStr ); // What: Page Load Call. Why: Each state starts from a fresh load of its route. How: This opens the path on the suite's dev server.

	await curPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Text measured before its web font loads would have the wrong size and wrapping. How: This waits until every font face has loaded.

	await revPagFun( curPagObj ); // What: Page Reveal Call. Why: Content that fades in on scroll is invisible until scrolled to. How: This scrolls through the page and back to the top.

	await curPagObj.evaluate( () => Promise.all( Array.from( document.images, ( imaCurEle ) => imaCurEle.decode() ) ) ); // What: Images Decoded Wait. Why: A check shouldn't measure or capture the page before its images are drawn. How: This waits until every image on the page has finished decoding.



	if ( staRcdObj.actFun ) await staRcdObj.actFun( curPagObj ); // What: State Action Call. Why: Some states need something opened first. How: This runs the state's action, if it has one.



	await waiSetFun( curPagObj ); // What: Settled Page Wait. Why: A check should see the page at rest, not mid-fade. How: This waits until the page stays still for half a second.


}

// #endregion opeStaFun

// #endregion Helpers



// #region Exports

export { opeStaFun, STA_RCD_ARR, type StaRcdTyp }; // What: Named Exports. Why: The accessibility, interaction, rendering, and responsive specs share these states and their opener. How: This exports the state list, its type, and the helper that opens one.

// #endregion Exports


