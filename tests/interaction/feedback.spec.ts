


// #region Imports

import { expect      } from '@playwright/test';      // What: Expect. Why: Each state passes only when every control responds. How: This asserts each problem list is empty.
import { fakNetFun   } from '../support/netlify.ts'; // What: Fake Netlify Function. Why: The contact form's error, and the phone link inside it, only show once a request fails. How: This answers the form's posts in the browser with a server error.
import { opeStaFun   } from '../support/states.ts';  // What: Open State Function. Why: Each check opens and settles its state first. How: This loads it and waits for it.
import { STA_REC_ARR } from '../support/states.ts';  // What: State Record Array. Why: Every page state is checked. How: This lists them.
import { test        } from '@playwright/test';      // What: Test. Why: Each check of each state is its own test. How: This declares them.


import type { ElementHandle } from '@playwright/test'; // What: Element Handle. Why: Each control is probed through a handle to its element. How: This types the control list.
import type { Page          } from '@playwright/test'; // What: Page. Why: The helpers that drive the page from the test take a Playwright page, while those that run inside it take none. How: This types the driving helpers' page parameters.

// #endregion Imports



/**
 * feedback.spec.ts = Feedback Spec
 *
 * @summary
 * Checks the interaction feedback rule on every page state, in whichever
 * engine the project runs. Every visible link and button has to look different
 * while hovered than at rest, look different again while pressed, and
 * transition its focus ring's outline, and the first keyboard stop has to draw
 * that ring at full width once it has eased in. Every visible form field has
 * to look different once keyboard focus reaches it and transition its focus
 * ring's outline too. Under reduced motion every control keeps its hover and
 * press changes, and every field its focus change, but transitions nothing.
 * The phone link inside the contact form's error message only shows once a
 * request fails, so it gets checks of its own, both ways, after a faked
 * Netlify error at desktop width. On the home page, the service cards and
 * the service area tags respond to hover too, though neither is a control, so
 * each has to look different hovered and transition that change, or change
 * instantly under reduced motion.
 * Real clicks are blocked during the checks, so pressing a link or the menu's
 * links never navigates or closes anything mid-check.
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

const ERR_LIN_STR = '#contact form [role="alert"] a';             // What: Error Link String. Why: The phone link in the contact form's error message is probed on its own. How: This selects the link inside the form's alert region.
const HOV_TAR_STR = '[class*="serCarDiv"], [class*="areTagSpa"]'; // What: Hover Target String. Why: The service cards and the service area tags respond to hover without being controls, so the control probes never reach them. How: This matches both by their CSS module classes, whose names Vite keeps inside each hashed class.
const SET_WAI_NUM = 400;                                          // What: Settle Wait Number. Why: Each look is read once its transition has finished, and the longest interface transition runs about 367ms. How: This is the pause, in milliseconds, after each hover, press, or focus.

// #endregion Constants



// #region Helpers

// #region cliBloFun

/**
 * cliBloFun = Click Block Function
 *
 * @summary
 * Runs inside the page and cancels every click before anything handles it,
 * so pressing a control during a check never follows a link, starts a phone
 * call, or closes the menu. It listens on the document in the capture
 * phase, ahead of React's own listener on the app's root, and both prevents
 * the click's default and stops it from going any further. Passed to
 * Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * page.evaluate(cliBloFun) // => void
 * ```
 *
*/

function cliBloFun () : void {


	document.addEventListener( 'click', ( cliEveObj ) => { // What: Click Block Listener. Why: A press during a check shouldn't do anything. How: This cancels every click in the capture phase, before the page or React sees it.


		cliEveObj.preventDefault(); // What: Default Prevention Call. Why: A link shouldn't navigate mid-check. How: This cancels the click's default.

		cliEveObj.stopPropagation(); // What: Propagation Stop Call. Why: React's handlers, such as a menu link closing the menu, shouldn't run either. How: This keeps the click from reaching the app's root.


	}, true ); // What: Capture Phase Flag. Why: The block has to run before anything else sees the click. How: This registers the listener for the capture phase.


}

// #endregion cliBloFun



// #region conLisFun

/**
 * conLisFun = Control List Function
 *
 * @summary
 * Collects every control a visitor can reach on the page as it stands: each
 * element the selector matches that's visible, not taken out of the tab order
 * with tabindex -1, and not inside inert content (the closed mobile menu), so
 * the same list serves the links and buttons and the form fields. Handles are
 * taken once, so restyling while the checks scroll (the nav bar's scrolled
 * look) can't shift the list.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to collect from.
 * @param conSelStr - Control Selector String: The kinds of control to collect,
 *                    'a, button' for the links and buttons or 'input, select,
 *                    textarea' for the form fields.
 *
 * @returns Every reachable control.
 * @see {@link conHanArr}
 *
 * @example
 * ```ts
 * conLisFun(page, 'a, button') // => [ ElementHandle, ... ]
 * ```
 *
*/

async function conLisFun ( curPagObj : Page, conSelStr : string ) : Promise< ElementHandle< Element >[] > {


	const conHanArr : ElementHandle< Element >[] = []; // What: Control Handle Array. Why: The reachable controls are gathered one by one. How: This collects them.


	for ( const conCurObj of await curPagObj.$$( conSelStr ) ) { // What: Control Loop. Why: Every control the selector matches is judged on its own. How: This keeps each one a visitor can reach.


		const conReaBoo = await conCurObj.evaluate( ( conCurEle ) => conCurEle.getAttribute( 'tabindex' ) !== '-1' && !conCurEle.closest( '[inert]' ) ); // What: Control Reachable Boolean. Why: A control outside the tab order or inside inert content can't be reached. How: This checks both inside the page.


		if ( conReaBoo && await conCurObj.isVisible() ) conHanArr.push( conCurObj ); // What: Reachable Control Record. Why: Only controls a visitor can see and reach are checked. How: This keeps the control when it's both.


	}



	return conHanArr; // What: Control Handle Return. Why: The checks probe each control in turn. How: This hands back every reachable control's handle.


}

// #endregion conLisFun



// #region errOpeFun

/**
 * errOpeFun = Error Open Function
 *
 * @summary
 * Opens the home page at desktop width with Netlify faked to fail, fills in
 * the contact form's required fields, sends it, and waits for the error
 * message, so the phone link inside it can be probed. Real clicks are blocked
 * once the error shows, so pressing the link never starts a call. A caller
 * that needs reduced motion sets it first.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open.
 *
 * @returns A promise that settles once the error shows and clicks are
 *          blocked, with no value.
 *
 * @example
 * ```ts
 * errOpeFun(page) // => Promise<void>
 * ```
 *
*/

async function errOpeFun ( curPagObj : Page ) : Promise< void > {


	await fakNetFun( curPagObj, 500 ); // What: Netlify Error Fake Call. Why: The request has to fail for the error to show. How: This answers every post with a server error.

	await opeStaFun( curPagObj, STA_REC_ARR.find( ( staRecObj ) => staRecObj.ideStr === 'home-desktop' )! ); // What: Home Desktop Open Call. Why: The form lives in the Contact section, checked at desktop width. How: This loads and settles the home page at 1,440px. // What: Non-Null Note. Why: find types its result as possibly undefined. How: STA_REC_ARR always holds the home-desktop state.

	await curPagObj.getByLabel( 'Full Name *' ).fill( 'Test Visitor' ); // What: Name Fill Call. Why: The name is required. How: This types a name.
	await curPagObj.getByLabel( 'Phone *' ).fill( '(785) 555-0100' );   // What: Phone Fill Call. Why: The phone number is required. How: This types a number from the reserved 555-01xx range.

	await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Submit Click Call. Why: The error only shows after a send. How: This sends the request, which the fake fails.


	await expect( curPagObj.locator( ERR_LIN_STR ) ).toBeVisible(); // What: Error Link Shown Assertion. Why: The link is probed once the error has rendered, and an empty probe would pass without checking anything. How: This waits for the link inside the error message.


	await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing the link shouldn't start a call. How: This cancels every click from here on.


}

// #endregion errOpeFun



// #region sigEleFun

/**
 * sigEleFun = Signature Element Function
 *
 * @summary
 * Runs inside the page and describes how a control looks right now, as one
 * string of the styles feedback usually changes (color, background, border
 * color, transform, and opacity) for the control and every element inside
 * it, so a change to its icon lines or its label counts as the control's own.
 * Passed to Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param eleCurEle - Element Current Element: The control to describe.
 *
 * @returns The control's look, as one string to compare.
 *
 * @example
 * ```ts
 * handle.evaluate(sigEleFun) // => 'rgb(...),rgba(...),none,1,...|...'
 * ```
 *
*/

function sigEleFun ( eleCurEle : Element ) : string {


	const sigStyFun = ( sigCurEle : Element ) => { // What: Signature Style Function. Why: Each element's look is read the same way. How: This joins one element's feedback styles into one string.


		const styCurObj = getComputedStyle( sigCurEle ); // What: Style Current Object. Why: The element's styles are read as they're drawn now. How: This reads its computed styles.



		return [ styCurObj.color, styCurObj.backgroundColor, styCurObj.borderColor, styCurObj.transform, styCurObj.opacity ].join( ',' ); // What: Element Signature Return. Why: One element's look compares as one string. How: This joins its feedback styles.


	};



	return [ eleCurEle, ...eleCurEle.querySelectorAll( '*' ) ].map( sigStyFun ).join( '|' ); // What: Signature Return. Why: Two looks compare as one string. How: This joins the signatures of the control and everything inside it.


}

// #endregion sigEleFun



// #region feeProFun

/**
 * feeProFun = Feedback Problems Function
 *
 * @summary
 * Probes every reachable control and returns a problem for each one that gives
 * no feedback. Each control is scrolled into view, read at rest with the
 * pointer away, read again while hovered, and again while the mouse button is
 * held on it, every look read once its transition has settled. A control that
 * looks the same at rest and hovered, or hovered and pressed, is a problem.
 * Normally a control whose transitions all take no time is a problem too, and
 * its transition list must include the focus ring's outline-width, so the ring
 * eases in; under reduced motion every one of its transition durations must be
 * zero instead. The caller blocks real clicks first, so releasing the mouse
 * does nothing.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to probe.
 * @param conSelStr - Control Selector String: The controls to probe, either
 *                    'a, button' for every link and button or a narrower
 *                    selector for one control.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion.
 *
 * @returns Every feedback problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * feeProFun(page, 'a', false) // => [ 'a "Home" looks the same pressed' ]
 * ```
 *
*/

async function feeProFun ( curPagObj : Page, conSelStr : string, redMotBoo : boolean ) : Promise< string[] > {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.


	for ( const conCurObj of await conLisFun( curPagObj, conSelStr ) ) { // What: Control Probe Loop. Why: Every reachable control has to respond. How: This reads each one the selector matches at rest, hovered, and pressed.


		const conDesStr = await conCurObj.evaluate( ( conCurEle ) => `${ conCurEle.tagName.toLowerCase() } "${ ( conCurEle.getAttribute( 'aria-label' ) || conCurEle.textContent || '' ).trim().slice( 0, 30 ) }"` ); // What: Control Description String. Why: A problem should name the control a person would recognize. How: This joins its tag with its label or text.


		await conCurObj.scrollIntoViewIfNeeded(); // What: Control Scroll Call. Why: A control has to be on screen to hover or press. How: This scrolls it into view.

		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Away Call. Why: The resting look is read with nothing hovered. How: This moves the pointer to the corner of the bar.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Rest Settle Wait. Why: Any earlier hover has to finish fading. How: This pauses for the settle time.


		const resSigStr = await conCurObj.evaluate( sigEleFun ); // What: Rest Signature String. Why: The resting look is what hover is compared with. How: This reads it.


		await conCurObj.hover(); // What: Control Hover Call. Why: Hover feedback is the first thing checked. How: This moves the pointer onto the control.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Hover Settle Wait. Why: The hover look is read once it has eased in. How: This pauses for the settle time.


		const hovSigStr = await conCurObj.evaluate( sigEleFun ); // What: Hover Signature String. Why: The hovered look is compared with rest and with pressed. How: This reads it.


		await curPagObj.mouse.down(); // What: Mouse Down Call. Why: A press shows while the button is held. How: This holds the mouse button down on the control.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Press Settle Wait. Why: The pressed look is read once it has eased in. How: This pauses for the settle time.


		const preSigStr = await conCurObj.evaluate( sigEleFun );                                                         // What: Press Signature String. Why: The pressed look is compared with hovered. How: This reads it.
		const traLisStr = await conCurObj.evaluate( ( conCurEle ) => getComputedStyle( conCurEle ).transitionProperty ); // What: Transition List String. Why: The focus ring's ease depends on the control listing its outline. How: This reads the control's transitioned properties.
		const traDurStr = await conCurObj.evaluate( ( conCurEle ) => getComputedStyle( conCurEle ).transitionDuration ); // What: Transition Duration String. Why: Reduced motion should leave nothing moving. How: This reads the control's transition durations.


		await curPagObj.mouse.up(); // What: Mouse Up Call. Why: The press has to end before the next control. How: This releases the button, whose click the caller has blocked.



		if ( resSigStr === hovSigStr ) proLisArr.push( `${ conDesStr } looks the same hovered` ); // What: Hover Check. Why: A hovered control has to respond. How: This records one that doesn't change.



		if ( hovSigStr === preSigStr ) proLisArr.push( `${ conDesStr } looks the same pressed` ); // What: Press Check. Why: A press has to register before anything happens. How: This records one that doesn't change.



		if ( redMotBoo && !/^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ conDesStr } still transitions under reduced motion (${ traDurStr })` ); // What: Reduced Motion Check. Why: Asking for less motion should stop every transition. How: This records a control with any duration above zero.

		else if ( !redMotBoo && /^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ conDesStr } changes without a transition` ); // What: Transition Check. Why: Every hover, press, and focus change should ease rather than snap. How: This records a control whose every transition duration is zero.

		else if ( !redMotBoo && !traLisStr.includes( 'outline-width' ) ) proLisArr.push( `${ conDesStr } doesn't transition its focus ring` ); // What: Focus Ease Check. Why: The focus ring should ease in rather than snap. How: This records a control whose transition list leaves out the outline.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion feeProFun



// #region fieSigFun

/**
 * fieSigFun = Field Signature Function
 *
 * @summary
 * Runs inside the page and describes how a form field looks right now, as one
 * string of the styles its focus changes (its border color and its outline's
 * color and width). Passed to Playwright's evaluate, so it can't read
 * anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param fieCurEle - Field Current Element: The form field to describe.
 *
 * @returns The field's look, as one string to compare.
 *
 * @example
 * ```ts
 * handle.evaluate(fieSigFun) // => 'rgb(200, 208, 224),rgb(30, 86, 200),0px'
 * ```
 *
*/

function fieSigFun ( fieCurEle : Element ) : string {


	const styCurObj = getComputedStyle( fieCurEle ); // What: Style Current Object. Why: The field's styles are read as they're drawn now. How: This reads its computed styles.



	return [ styCurObj.borderColor, styCurObj.outlineColor, styCurObj.outlineWidth ].join( ',' ); // What: Field Signature Return. Why: Two looks compare as one string. How: This joins the field's border color and outline.


}

// #endregion fieSigFun



// #region fieProFun

/**
 * fieProFun = Field Problems Function
 *
 * @summary
 * Probes every form field a visitor can reach (each visible input, select,
 * and textarea) and returns a problem for each one that gives no focus
 * feedback. Each field is scrolled into view and read at rest, then focused
 * by keyboard, by stepping back off it with Shift+Tab and onto it again with
 * Tab, and read once its transition has settled. A field the Tab press doesn't
 * land on, or that looks the same focused as at rest (its border color and
 * outline), is a problem. Normally a field whose transitions all take no time
 * is a problem too, and its transition list must include the focus ring's
 * outline-width, so the ring eases in; under reduced motion every one of its
 * transition durations must be zero instead.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to probe.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion.
 *
 * @returns Every focus feedback problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * fieProFun(page, false) // => [ 'input "email" looks the same focused' ]
 * ```
 *
*/

async function fieProFun ( curPagObj : Page, redMotBoo : boolean ) : Promise< string[] > {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.


	for ( const fieCurObj of await conLisFun( curPagObj, 'input, select, textarea' ) ) { // What: Field Probe Loop. Why: Every reachable form field has to show focus. How: This reads each one at rest and focused by keyboard.


		const fieDesStr = await fieCurObj.evaluate( ( fieCurEle ) => `${ fieCurEle.tagName.toLowerCase() } "${ fieCurEle.getAttribute( 'name' ) || '' }"` ); // What: Field Description String. Why: A problem should name the field in terms of the form. How: This joins its tag with the name Netlify records it under.


		await fieCurObj.scrollIntoViewIfNeeded(); // What: Field Scroll Call. Why: A field has to be on screen for its look to be read. How: This scrolls it into view.


		const resSigStr = await fieCurObj.evaluate( fieSigFun ); // What: Rest Signature String. Why: The resting look is what focus is compared with. How: This joins the field's border color and outline.


		await fieCurObj.focus(); // What: Field Focus Call. Why: The keyboard steps start from the field itself. How: This focuses it so Shift+Tab steps off it.

		await curPagObj.keyboard.press( 'Shift+Tab' ); // What: Back Tab Press Call. Why: Focus has to arrive by keyboard, the way a keyboard user reaches the field. How: This steps focus back to the stop before the field.

		await curPagObj.keyboard.press( 'Tab' ); // What: Tab Press Call. Why: The field is reached by keyboard. How: This steps focus forward onto the field again.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Focus Settle Wait. Why: The focused look is read once it has eased in. How: This pauses for the settle time.


		const focFieBoo = await fieCurObj.evaluate( ( fieCurEle ) => fieCurEle === document.activeElement );             // What: Focused Field Boolean. Why: The focused look only counts when the Tab press landed on the field. How: This checks the field holds focus.
		const focSigStr = await fieCurObj.evaluate( fieSigFun );                                                         // What: Focus Signature String. Why: The focused look is compared with rest. How: This joins the field's border color and outline.
		const traDurStr = await fieCurObj.evaluate( ( fieCurEle ) => getComputedStyle( fieCurEle ).transitionDuration ); // What: Transition Duration String. Why: Reduced motion should leave nothing moving. How: This reads the field's transition durations.
		const traLisStr = await fieCurObj.evaluate( ( fieCurEle ) => getComputedStyle( fieCurEle ).transitionProperty ); // What: Transition List String. Why: The focus ring's ease depends on the field listing its outline. How: This reads the field's transitioned properties.



		if ( !focFieBoo ) proLisArr.push( `${ fieDesStr } isn't reached by Tab` ); // What: Keyboard Reach Check. Why: A keyboard user has to be able to reach every field. How: This records one the Tab press didn't land on.

		else if ( resSigStr === focSigStr ) proLisArr.push( `${ fieDesStr } looks the same focused` ); // What: Focus Check. Why: A focused field has to stand out. How: This records one whose border and outline don't change.



		if ( redMotBoo && !/^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ fieDesStr } still transitions under reduced motion (${ traDurStr })` ); // What: Reduced Motion Check. Why: Asking for less motion should stop every transition. How: This records a field with any duration above zero.

		else if ( !redMotBoo && /^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ fieDesStr } changes without a transition` ); // What: Transition Check. Why: A field's focus change should ease rather than snap. How: This records a field whose every transition duration is zero.

		else if ( !redMotBoo && !traLisStr.includes( 'outline-width' ) ) proLisArr.push( `${ fieDesStr } doesn't transition its focus ring` ); // What: Focus Ease Check. Why: The focus ring should ease in rather than snap. How: This records a field whose transition list leaves out the outline.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion fieProFun



// #region hovProFun

/**
 * hovProFun = Hover Problems Function
 *
 * @summary
 * Probes every visible service card and service area tag and returns a
 * problem for each one that gives no hover feedback. Neither is a control, so
 * only hover is checked: each is scrolled into view, read at rest with the
 * pointer away and again while hovered, every look read once its transition
 * has settled, and one that looks the same both ways is a problem. Its
 * transition durations are read from the element and its ::after layer, where
 * a card's shadow fades in. Normally one whose durations are all zero is a
 * problem; under reduced motion every duration must be zero instead, while
 * the hover look still has to change. Finding nothing to probe is a problem
 * too, so the check can't pass without checking anything.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to probe.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion.
 *
 * @returns Every hover feedback problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * hovProFun(page, false) // => [ 'span "Topeka, KS" looks the same hovered' ]
 * ```
 *
*/

async function hovProFun ( curPagObj : Page, redMotBoo : boolean ) : Promise< string[] > {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.

	const tarHanArr = await conLisFun( curPagObj, HOV_TAR_STR ); // What: Target Handle Array. Why: Every visible card and tag is probed. How: This collects them the way the controls are collected.


	if ( !tarHanArr.length ) proLisArr.push( 'no service card or area tag to probe' ); // What: Empty Probe Check. Why: A probe that finds nothing would pass without checking anything. How: This records a problem when no card or tag is found.



	for ( const tarCurObj of tarHanArr ) { // What: Target Probe Loop. Why: Every card and tag has to respond to hover. How: This reads each one at rest and hovered.


		const tarDesStr = await tarCurObj.evaluate( ( tarCurEle ) => `${ tarCurEle.tagName.toLowerCase() } "${ ( tarCurEle.textContent || '' ).trim().slice( 0, 30 ) }"` ); // What: Target Description String. Why: A problem should name the card or tag a person would recognize. How: This joins its tag with the start of its text.


		await tarCurObj.scrollIntoViewIfNeeded(); // What: Target Scroll Call. Why: A card or tag has to be on screen to hover. How: This scrolls it into view.

		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Away Call. Why: The resting look is read with nothing hovered. How: This moves the pointer to the corner of the bar.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Rest Settle Wait. Why: Any earlier hover has to finish fading. How: This pauses for the settle time.


		const resSigStr = await tarCurObj.evaluate( sigEleFun ); // What: Rest Signature String. Why: The resting look is what hover is compared with. How: This reads it.


		await tarCurObj.hover(); // What: Target Hover Call. Why: Hover is the one interaction a card or tag has. How: This moves the pointer onto it.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Hover Settle Wait. Why: The hover look is read once it has eased in. How: This pauses for the settle time.


		const hovSigStr = await tarCurObj.evaluate( sigEleFun ); // What: Hover Signature String. Why: The hovered look is compared with rest. How: This reads it.
		const traDurStr = await tarCurObj.evaluate( ( tarCurEle ) => `${ getComputedStyle( tarCurEle ).transitionDuration }, ${ getComputedStyle( tarCurEle, '::after' ).transitionDuration }` ); // What: Transition Duration String. Why: A card's shadow fades in on its ::after layer, so both have to ease normally and stand still under reduced motion. How: This joins the element's durations with its ::after layer's.



		if ( resSigStr === hovSigStr ) proLisArr.push( `${ tarDesStr } looks the same hovered` ); // What: Hover Check. Why: A hovered card or tag has to respond, under reduced motion too. How: This records one that doesn't change.



		if ( redMotBoo && !/^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ tarDesStr } still transitions under reduced motion (${ traDurStr })` ); // What: Reduced Motion Check. Why: Asking for less motion should stop every transition. How: This records a card or tag with any duration above zero.

		else if ( !redMotBoo && /^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ tarDesStr } changes without a transition` ); // What: Transition Check. Why: A hover change should ease rather than snap. How: This records a card or tag whose every transition duration is zero.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion hovProFun

// #endregion Helpers



// #region Module Init

for ( const staRecObj of STA_REC_ARR ) { // What: State Test Loop. Why: Every page state is checked. How: This declares each check once per state.


	test( `${ staRecObj.ideStr } gives every control hover, press, and focus feedback`, async ( { page : curPagObj } ) => { // What: Feedback Test. Why: Every interaction should visibly register. How: This opens the state, blocks clicks, probes every control, and on the home states every service card and area tag, and checks it finds no problems.


		test.slow(); // What: Slow Test Mark. Why: Probing every control's hover, press, and focus takes about 28 seconds in Chromium alone, which ran past the default 30-second timeout when every suite shared the machine. How: This triples this test's timeout.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The controls are probed with the state settled. How: This loads and settles it.

		await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing a control shouldn't navigate or close anything. How: This cancels every click from here on.


		expect( await feeProFun( curPagObj, 'a, button', false ) ).toEqual( [] ); // What: No Feedback Problems Assertion. Why: The state passes only when every control responds. How: This compares the problems with an empty list, so a failure prints each one.
		expect( await fieProFun( curPagObj, false ) ).toEqual( [] );              // What: No Field Problems Assertion. Why: The state passes only when every form field shows focus. How: This compares the problems with an empty list, so a failure prints each one.


		if ( staRecObj.ideStr.startsWith( 'home-' ) ) expect( await hovProFun( curPagObj, false ) ).toEqual( [] ); // What: No Hover Problems Assertion. Why: The service cards and area tags respond to hover, and only the home states show them with nothing covering them. How: This compares their problems with an empty list on the home desktop and phone states, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } eases its focus ring in to full width`, async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Focus Ring Test. Why: A keyboard user has to see where focus lands. How: This tabs to the first stop and checks its ring reaches 2px once it has eased in.


		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The walk starts from the state settled. How: This loads and settles it.

		await curPagObj.keyboard.press( engNamStr === 'webkit' ? 'Alt+Tab' : 'Tab' ); // What: First Tab Press Call. Why: The ring shows only for keyboard focus. How: This tabs to the first stop, holding Alt in WebKit, which otherwise skips links the way Safari does.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Ring Settle Wait. Why: The ring is read once it has grown in. How: This pauses for the settle time.


		expect( await curPagObj.evaluate( () => getComputedStyle( document.activeElement as Element ).outlineWidth ) ).toBe( '2px' ); // What: Full Ring Assertion. Why: The ring has to reach its full width. How: This reads the focused stop's outline width, which the large border width token snaps to 2px. // What: Type Assertion Note. Why: activeElement types as possibly null. How: The Tab press just put focus on a stop.


	} );



	test( `${ staRecObj.ideStr } keeps feedback without motion under reduced motion`, async ( { page : curPagObj } ) => { // What: Reduced Motion Feedback Test. Why: Visitors who ask for less motion still need to see their actions register. How: This probes every control, and on the home states every service card and area tag, with reduced motion on and checks it finds no problems.


		test.slow(); // What: Slow Test Mark. Why: Probing every control's hover, press, and focus takes about 28 seconds in Chromium alone, which ran past the default 30-second timeout when every suite shared the machine. How: This triples this test's timeout.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The controls are probed with the state settled. How: This loads and settles it.

		await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing a control shouldn't navigate or close anything. How: This cancels every click from here on.


		expect( await feeProFun( curPagObj, 'a, button', true ) ).toEqual( [] ); // What: No Reduced Motion Problems Assertion. Why: Every control has to respond without moving. How: This compares the problems with an empty list, so a failure prints each one.
		expect( await fieProFun( curPagObj, true ) ).toEqual( [] );              // What: No Reduced Motion Field Problems Assertion. Why: Every form field has to show focus without moving. How: This compares the problems with an empty list, so a failure prints each one.


		if ( staRecObj.ideStr.startsWith( 'home-' ) ) expect( await hovProFun( curPagObj, true ) ).toEqual( [] ); // What: No Reduced Motion Hover Problems Assertion. Why: The service cards and area tags have to keep their hover look without moving. How: This compares their problems with an empty list on the home desktop and phone states, so a failure prints each one.


	} );


}



test( "the contact form error's phone link gives hover, press, and focus feedback", async ( { page : curPagObj } ) => { // What: Error Link Feedback Test. Why: The error's phone link only renders after a failed send, so no page state reaches it. How: This fails a send, probes the link, and checks it finds no problems.


	await errOpeFun( curPagObj ); // What: Error Open Call. Why: The link only exists once a send has failed. How: This fails a send and waits for the error.


	expect( await feeProFun( curPagObj, ERR_LIN_STR, false ) ).toEqual( [] ); // What: No Error Link Problems Assertion. Why: The link has to respond like every other control. How: This compares the problems with an empty list, so a failure prints each one.


} );



test( "the contact form error's phone link keeps feedback without motion under reduced motion", async ( { page : curPagObj } ) => { // What: Reduced Motion Error Link Test. Why: Visitors who ask for less motion still need to see the link respond. How: This fails a send with reduced motion on, probes the link, and checks it finds no problems.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

	await errOpeFun( curPagObj ); // What: Error Open Call. Why: The link only exists once a send has failed. How: This fails a send and waits for the error.


	expect( await feeProFun( curPagObj, ERR_LIN_STR, true ) ).toEqual( [] ); // What: No Reduced Motion Error Link Problems Assertion. Why: The link has to respond without moving. How: This compares the problems with an empty list, so a failure prints each one.


} );

// #endregion Module Init


