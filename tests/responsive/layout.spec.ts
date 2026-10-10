


// #region Imports

import { expect    } from '@playwright/test';     // What: Expect. Why: Each width passes only when its layout holds together. How: This asserts each problem list is empty.
import { opeStaFun } from '../support/states.ts'; // What: Open State Function. Why: Each width is measured settled. How: This loads the page and waits for it.
import { test      } from '@playwright/test';     // What: Test. Why: Each page at each width is its own test. How: This declares them.

// #endregion Imports



/**
 * layout.spec.ts = Layout Spec
 *
 * @summary
 * Measures the home page, the 404 page, and the open mobile menu across a
 * range of screen widths, in whichever engine the project runs, and fails a
 * width whose layout breaks: the page scrolling sideways, a visible element
 * reaching past either edge of the screen (unless an ancestor clips it on
 * purpose), text spilling out of its own box, or two controls a visitor can
 * reach overlapping each other. The widths run from 320px, WCAG's narrowest
 * reflow width, to 1,920px, and include a pixel either side of each of the
 * site's breakpoints, where a layout switches and is most likely to crowd.
 * Pages open under reduced motion, which changes nothing about the layout but
 * skips the wait for entrance animations.
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

type LayCasTyp = { // What: Layout Case Type. Why: Each test measures one page in one state. How: This names the case, its path, and whether it opens the menu.


	ideStr : string,  // What: Identifier String. Why: Each test names the case it measures. How: This becomes part of the test title.
	menBoo : boolean, // What: Menu Boolean. Why: The open menu is measured as its own case. How: This is true when the case opens it.
	patStr : string   // What: Path String. Why: Each case opens one route. How: This is the path loaded from the dev server.


};
const LAY_CAS_ARR : LayCasTyp[] = [ // What: Layout Case Array. Why: The page and the open menu are measured the same way. How: Each row names a case, its path, and whether it opens the menu.


	{ ideStr : 'home',      menBoo : false, patStr : '/'        }, // What: Home Case. Why: The home page holds all of the site's layout. How: This measures it as loaded.
	{ ideStr : 'not-found', menBoo : false, patStr : '/missing' }, // What: Not Found Case. Why: The 404 page has its own centered layout. How: This measures an address the site doesn't have, closed.
	{ ideStr : 'menu',      menBoo : true,  patStr : '/'        }  // What: Menu Case. Why: The open menu stacks the links and phone number its own way. How: This measures the home page with the menu open.


];



const MEN_MAX_NUM = 768; // What: Menu Maximum Number. Why: The mobile menu exists only up to the site's 768px breakpoint. How: The menu case is measured only at widths up to this.



const WID_LIS_ARR = [ 320, 360, 390, 414, 480, 520, 521, 580, 581, 768, 769, 900, 901, 1024, 1025, 1280, 1440, 1920 ]; // What: Width List Array. Why: Layouts crowd at the narrowest widths and switch at the breakpoints. How: This lists common screen widths plus each breakpoint and the pixel past it, 480px staying as a common landscape phone width.

// #endregion Constants



// #region Helpers

// #region layProFun

/**
 * layProFun = Layout Problems Function
 *
 * @summary
 * Runs inside the page and returns every layout problem it finds, each
 * naming the element by its tag and its module class's readable part. The
 * page scrolling sideways is one problem. A visible element counts as
 * spilling past an edge when it reaches more than a pixel beyond the
 * viewport and no ancestor clips its overflow. An element with text of its
 * own spills its box when its content is more than a pixel wider than it
 * and it doesn't clip or scroll that content; inline elements are skipped,
 * since they have no box width of their own. Two reachable controls (links
 * and buttons that are visible, in the tab order, and not inside inert
 * content) overlap when their boxes share more than a pixel of area and
 * neither holds the other. Passed to Playwright's evaluate, so it can't read
 * anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns Every layout problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * page.evaluate(layProFun) // => [ 'a.navLinAnc overlaps a.navCtaAnc' ]
 * ```
 *
*/

function layProFun () : string[] {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.

	const vieWidNum = document.documentElement.clientWidth; // What: Viewport Width Number. Why: Edges and sideways scrolling are measured against the visible width. How: This reads the root's width without its scrollbar.



	const desEleFun = ( desCurEle : Element ) => `${ desCurEle.tagName.toLowerCase() }${ desCurEle.classList.length ? '.' + ( desCurEle.classList[ 0 ].split( '_' )[ 1 ] || desCurEle.classList[ 0 ] ) : '' }`; // What: Describe Element Function. Why: A problem should name the element in terms of the source. How: This joins the tag with the readable part of its hashed module class.


	const cliAncFun = ( cliCurEle : Element ) => { // What: Clipped Ancestor Function. Why: An element an ancestor clips can reach past the edge without showing there. How: This reports whether any ancestor hides, clips, or scrolls its overflow.


		for ( let ancCurEle = cliCurEle.parentElement; ancCurEle; ancCurEle = ancCurEle.parentElement ) if ( getComputedStyle( ancCurEle ).overflowX !== 'visible' ) return true; // What: Ancestor Overflow Loop. Why: Any clipping ancestor contains the element. How: This walks up the tree and returns as soon as one doesn't show its overflow.



		return false; // What: Unclipped Return. Why: No ancestor clips the element, so its spill would show. How: This reports that none was found.


	};



	if ( document.documentElement.scrollWidth > vieWidNum ) proLisArr.push( `the page scrolls sideways by ${ document.documentElement.scrollWidth - vieWidNum }px` ); // What: Sideways Scroll Check. Why: Nobody should have to scroll sideways to read the page. How: This records how far the page reaches past the visible width.



	for ( const layCurEle of document.body.querySelectorAll( '*' ) ) { // What: Element Loop. Why: Any element can spill. How: This measures each one in turn.


		const recCurObj = layCurEle.getBoundingClientRect(); // What: Rect Current Object. Why: Edges are judged from the element's box. How: This measures it.
		const styCurObj = getComputedStyle( layCurEle );     // What: Style Current Object. Why: Hidden and inline elements are judged differently. How: This reads its computed styles.

		const zerWidBoo = !recCurObj.width;                   // What: Zero Width Boolean. Why: An element with no width takes no room. How: This checks its box has no width.
		const zerHeiBoo = !recCurObj.height;                  // What: Zero Height Boolean. Why: An element with no height takes no room. How: This checks its box has no height.
		const hidStyBoo = styCurObj.visibility !== 'visible'; // What: Hidden Style Boolean. Why: A hidden element doesn't show. How: This checks its computed visibility.

		const invEleBoo = zerWidBoo || zerHeiBoo || hidStyBoo; // What: Invisible Element Boolean. Why: Any one of these means the element can't break the layout. How: This combines them.


		if ( invEleBoo ) continue; // What: Invisible Element Guard. Why: An element that takes no room or doesn't show can't break the layout. How: This skips it.



		const rigSpiBoo = recCurObj.right > vieWidNum + 1; // What: Right Spill Boolean. Why: Content past the right edge is cut off or forces sideways scrolling. How: This checks the box reaches more than a pixel beyond the viewport's right.
		const lefSpiBoo = recCurObj.left < -1;             // What: Left Spill Boolean. Why: Content past the left edge is cut off. How: This checks the box starts more than a pixel before the viewport.
		const ancCliBoo = cliAncFun( layCurEle );          // What: Ancestor Clipped Boolean. Why: An element an ancestor clips doesn't show past the edge. How: This checks for a clipping ancestor.

		const edgSpiBoo = ( rigSpiBoo || lefSpiBoo ) && !ancCliBoo; // What: Edge Spill Boolean. Why: Only an unclipped element past an edge breaks the layout. How: This combines them.


		if ( edgSpiBoo ) proLisArr.push( `${ desEleFun( layCurEle ) } spills past the ${ rigSpiBoo ? 'right' : 'left' } edge` ); // What: Edge Spill Check. Why: Content past the edge is cut off or forces sideways scrolling. How: This records an unclipped element that reaches more than a pixel beyond the viewport.



		const ownTexBoo = [ ...layCurEle.childNodes ].some( ( chiCurNod ) => chiCurNod.nodeType === Node.TEXT_NODE && !!chiCurNod.textContent?.trim() ); // What: Own Text Boolean. Why: Only an element holding text itself can spill it. How: This checks its direct children for text that isn't just whitespace.
		const spiBoxBoo = layCurEle.scrollWidth > layCurEle.clientWidth + 1;                                                                             // What: Spill Box Boolean. Why: Content wider than its box has spilled out of it. How: This compares the content's width with the box's.
		const visOveBoo = styCurObj.overflowX === 'visible';                                                                                             // What: Visible Overflow Boolean. Why: Content a box clips or scrolls on purpose isn't a spill. How: This checks the box shows its overflow.
		const bloBoxBoo = styCurObj.display !== 'inline';                                                                                                // What: Block Box Boolean. Why: An inline element has no box width to compare with. How: This checks it isn't inline.

		const texSpiBoo = ownTexBoo && spiBoxBoo && visOveBoo && bloBoxBoo; // What: Text Spill Boolean. Why: All four together mean text has spilled out of its box. How: This combines them.


		if ( texSpiBoo ) proLisArr.push( `${ desEleFun( layCurEle ) } spills its text past its box` ); // What: Text Spill Check. Why: Text outside its box overlaps its neighbors or gets cut off. How: This records the element.


	}



	const conEleArr = [ ...document.querySelectorAll( 'a, button' ) ].filter( ( conCurEle ) => { // What: Control Element Array. Why: Only controls a visitor can see and reach have to stay apart. How: This keeps every link and button that's visible, in the tab order, and outside inert content.


		const tabOrdBoo = conCurEle.getAttribute( 'tabindex' ) !== '-1';          // What: Tab Order Boolean. Why: A control taken out of the tab order can't be reached. How: This checks it isn't tabindex -1.
		const notIneBoo = !conCurEle.closest( '[inert]' );                        // What: Not Inert Boolean. Why: Controls inside inert content can't be reached. How: This checks no ancestor is inert.
		const visStyBoo = getComputedStyle( conCurEle ).visibility === 'visible'; // What: Visible Style Boolean. Why: A hidden control can't be seen. How: This checks its computed visibility.
		const hasWidBoo = conCurEle.getBoundingClientRect().width > 0;            // What: Has Width Boolean. Why: A control with no width takes no room. How: This checks its box has width.

		const reaConBoo = tabOrdBoo && notIneBoo && visStyBoo && hasWidBoo; // What: Reachable Control Boolean. Why: All four together mean a visitor can see and reach the control. How: This combines them.



		return reaConBoo; // What: Reachable Control Return. Why: The filter keeps only reachable controls. How: This keeps the control when it's reachable.


	} );


	conEleArr.forEach( ( oneCurEle, oneIndNum ) => conEleArr.slice( oneIndNum + 1 ).forEach( ( twoCurEle ) => { // What: Control Pair Loop. Why: Overlap is a property of two controls. How: This visits every pair once.


		const oneRecObj = oneCurEle.getBoundingClientRect();                                                         // What: One Rect Object. Why: The pair's overlap is measured from both boxes. How: This measures the first.
		const twoRecObj = twoCurEle.getBoundingClientRect();                                                         // What: Two Rect Object. Why: The pair's overlap is measured from both boxes. How: This measures the second.
		const oveWidNum = Math.min( oneRecObj.right, twoRecObj.right ) - Math.max( oneRecObj.left, twoRecObj.left ); // What: Overlap Width Number. Why: Two boxes overlap only where both their spans cross. How: This measures how far their horizontal spans cross.
		const oveHeiNum = Math.min( oneRecObj.bottom, twoRecObj.bottom ) - Math.max( oneRecObj.top, twoRecObj.top ); // What: Overlap Height Number. Why: Two boxes overlap only where both their spans cross. How: This measures how far their vertical spans cross.

		const widOveBoo = oveWidNum > 0;                                                        // What: Width Overlap Boolean. Why: Boxes overlap only where their horizontal spans cross. How: This checks they do.
		const heiOveBoo = oveHeiNum > 0;                                                        // What: Height Overlap Boolean. Why: Boxes overlap only where their vertical spans cross. How: This checks they do.
		const areOveBoo = oveWidNum * oveHeiNum > 1;                                            // What: Area Overlap Boolean. Why: A shared edge or corner isn't a real overlap. How: This checks they share more than a pixel of area.
		const sepConBoo = !oneCurEle.contains( twoCurEle ) && !twoCurEle.contains( oneCurEle ); // What: Separate Control Boolean. Why: A control inside another overlaps it by design. How: This checks that neither holds the other.

		const conOveBoo = widOveBoo && heiOveBoo && areOveBoo && sepConBoo; // What: Control Overlap Boolean. Why: All four together mean two separate controls cover each other. How: This combines them.


		if ( conOveBoo ) proLisArr.push( `${ desEleFun( oneCurEle ) } overlaps ${ desEleFun( twoCurEle ) }` ); // What: Overlap Check. Why: Overlapping controls are hard to read and to tap. How: This records a pair sharing more than a pixel of area.


	} ) );



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion layProFun

// #endregion Helpers



// #region Module Init

for ( const layCasObj of LAY_CAS_ARR ) { // What: Case Loop. Why: The page and the open menu are measured. How: This declares each case's tests.


	for ( const widCurNum of WID_LIS_ARR.filter( ( widFilNum ) => !layCasObj.menBoo || widFilNum <= MEN_MAX_NUM ) ) { // What: Width Loop. Why: Each case is measured at every width it exists at. How: This declares one test per width, skipping menu widths past the breakpoint.


		test( `${ layCasObj.ideStr } holds its layout at ${ widCurNum }px`, async ( { page : curPagObj } ) => { // What: Layout Test. Why: The layout should hold together at every width. How: This opens the case at the width and lists its layout problems.


			await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Entrance animations don't change the layout, so waiting on them only slows the run. How: This makes the page match prefers-reduced-motion, which turns them off.

			await opeStaFun( curPagObj, { // What: Case Open Call. Why: The layout is measured settled. How: This opens the case's path at the width, opening the menu first for the menu case.


				heiNum : 900,              // What: Height Number. Why: Only the width changes this layout. How: Every case is measured at the same height.
				ideStr : layCasObj.ideStr, // What: Identifier String. Why: The state names its case. How: This reuses the case's name.
				patStr : layCasObj.patStr, // What: Path String. Why: The state opens the case's route. How: This reuses the case's path.
				widNum : widCurNum,        // What: Width Number. Why: The width is what this test varies. How: This sizes the viewport to the loop's width.

				...( layCasObj.menBoo ? { actFun : async ( actPagObj ) => { await actPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); } } : {} ) // What: Menu Action Spread. Why: Only the menu case opens the menu. How: This adds the toggle click as the state's action for that case.


			} );


			expect( await curPagObj.evaluate( layProFun ) ).toEqual( [] ); // What: No Layout Problems Assertion. Why: The width passes only with nothing spilling or overlapping. How: This compares the problems with an empty list, so a failure prints each one.


		} );


	}


}

// #endregion Module Init


