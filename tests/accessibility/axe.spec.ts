


// #region Imports

import AxeBuilder from '@axe-core/playwright'; // What: Axe Builder. Why: axe-core finds the mechanical accessibility failures, such as low contrast. How: This runs its scan against a Playwright page.


import { expect      } from '@playwright/test';      // What: Expect. Why: A state passes only with no violations. How: This asserts the violation list is empty, and waits for content a scan needs.
import { fakNetFun   } from '../support/netlify.ts'; // What: Fake Netlify Function. Why: The form's thank-you message and its error only show once Netlify answers a send. How: This answers the form's posts in the browser with a chosen status.
import { opeStaFun   } from '../support/states.ts';  // What: Open State Function. Why: Each state has to be opened and settled before it's scanned. How: This loads it and waits for it.
import { STA_REC_ARR } from '../support/states.ts';  // What: State Record Array. Why: Every page state is scanned. How: This lists them.
import { test        } from '@playwright/test';      // What: Test. Why: Each state is its own test. How: This declares them.
import { waiSetFun   } from '../support/states.ts';  // What: Wait Settled Function. Why: The form's result should be scanned once it has finished fading in. How: This waits until the page stays still.


import type { Page     } from '@playwright/test'; // What: Page. Why: The scan helpers drive a Playwright page. How: This types their page parameters.
import type { TestInfo } from '@playwright/test'; // What: Test Info. Why: The report helper attaches results needing review to the running test. How: This types its test info parameter.

// #endregion Imports



/**
 * axe.spec.ts = Axe Spec
 *
 * @summary
 * Scans every page state, and the contact form's results once Netlify answers,
 * with axe-core against WCAG 2.2 A and AA plus axe's best-practice rules, in
 * whichever engine the project runs. A state passes only with zero violations,
 * and each failure says which rule broke and where. Anything axe can't decide
 * on its own (its "incomplete" results, such as text over an image) can't fail
 * the run, so it's printed and attached to the test as needing review by hand.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type AxeResTyp = Awaited< ReturnType< AxeBuilder[ 'analyze' ] > >; // What: Axe Results Type. Why: The scan's findings are summarized for the report, and axe-core itself is only a dependency of the Playwright integration. How: This reads the type from what AxeBuilder's analyze resolves to.

// #endregion Types



// #region Constants

const AXE_TAG_ARR = [ 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice' ]; // What: Axe Tag Array. Why: The site targets WCAG 2.2 AA, which includes every earlier A and AA rule, and axe's best practices catch common problems WCAG doesn't name. How: This limits the scan to those rule sets.



// #region FOR_RES_ARR

/**
 * FOR_RES_ARR = Form Result Array
 *
 * @summary
 * The contact form's two results, each scanned once it shows. Every row
 * shares one shape, so its fields carry no comments of their own:
 *
 * - `codNum` (Number): Code Number, the status the faked Netlify answers the
 *   send with.
 *
 * - `ideStr` (String): Identifier String, the result's name in the test's
 *   title.
 *
 * - `texStr` (String): Text String, words only that result shows, waited for
 *   before the scan.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const FOR_RES_ARR = [ // What: Form Result Array. Why: The form's thank-you message and its error bring new text and colors the page states never show. How: Each row names a result, the status that produces it, and text to wait for.


	{ codNum : 200, ideStr : 'form-sent',   texStr : 'Message Sent!'     }, // What: Sent Result Row. Why: A confirmed send swaps the form for the thank-you message. How: This answers with success and waits for its heading.
	{ codNum : 500, ideStr : 'form-failed', texStr : "didn't go through" }  // What: Failed Result Row. Why: A failed send shows the error in red on the white panel. How: This answers with a server error and waits for its message.


];

// #endregion FOR_RES_ARR

// #endregion Constants



// #region Helpers

// #region scaStaFun

/**
 * scaStaFun = Scan State Function
 *
 * @summary
 * Runs axe-core on the page as it stands, limited to the WCAG and
 * best-practice rule sets, and returns its full results. The caller opens
 * and settles the state first, so the scan never sees a page mid-load or
 * mid-animation.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to scan.
 *
 * @returns A promise that resolves with the scan's results.
 *
 * @example
 * ```ts
 * scaStaFun(page) // => { violations, incomplete, passes, ... }
 * ```
 *
*/

async function scaStaFun ( curPagObj : Page ) : Promise< AxeResTyp > {


	return new AxeBuilder( { page : curPagObj } ).withTags( AXE_TAG_ARR ).analyze(); // What: Axe Scan Return. Why: The scan's results decide the test. How: This builds an axe run for the page, limits it to the chosen rule sets, and runs it.


}

// #endregion scaStaFun



// #region sumResFun

/**
 * sumResFun = Summarize Results Function
 *
 * @summary
 * Turns one list of axe results into one readable line per rule: the rule's
 * id, its impact where axe gives one, its help text, and the selectors of
 * the elements it flagged. Used for both the violations, which fail the
 * test, and the incomplete results, which are only reported.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param resLisArr - Result List Array: Either the violations or the
 *                    incomplete results of one scan.
 *
 * @returns One line per rule.
 *
 * @example
 * ```ts
 * sumResFun(axeResObj.violations) // => [ 'color-contrast (serious): ...' ]
 * ```
 *
*/

function sumResFun ( resLisArr : AxeResTyp[ 'violations' ] ) : string[] {


	return resLisArr.map( ( resCurObj ) => `${ resCurObj.id } (${ resCurObj.impact || 'no impact' }): ${ resCurObj.help } at ${ resCurObj.nodes.map( ( nodCurObj ) => nodCurObj.target.join( ' ' ) ).join( ', ' ) }` ); // What: Result Lines Return. Why: A failure should say what broke and where without opening the report. How: This joins each rule's id, impact, help, and flagged selectors into one line.


}

// #endregion sumResFun



// #region scaRepFun

/**
 * scaRepFun = Scan Report Function
 *
 * @summary
 * Scans the page as it stands and decides the test: every result axe
 * couldn't decide is attached to the test as needing review and printed
 * under the project's and state's names, and the test fails on any
 * violation, listing each one. The caller opens and settles the state first.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to scan.
 * @param tesInfObj - Test Info Object: The running test, which collects the
 *                    review notes.
 * @param staIdeStr - State Identifier String: The state's name in the
 *                    printed review lines.
 *
 * @returns A promise that settles once the scan is reported, with no value.
 *
 * @example
 * ```ts
 * scaRepFun(page, testInfo, 'home-phone') // => Promise<void>
 * ```
 *
*/

async function scaRepFun ( curPagObj : Page, tesInfObj : TestInfo, staIdeStr : string ) : Promise< void > {


	const axeResObj = await scaStaFun( curPagObj );      // What: Axe Result Object. Why: Both the violations and the incomplete results come from one scan. How: This scans the page.
	const revLinArr = sumResFun( axeResObj.incomplete ); // What: Review Line Array. Why: Results axe couldn't decide need a person's look. How: This summarizes them.


	for ( const revLinStr of revLinArr ) tesInfObj.annotations.push( { description : revLinStr, type : 'needs review' } ); // What: Review Annotations Loop. Why: The report should list each result needing review beside its test. How: This attaches each line as an annotation.



	if ( revLinArr.length ) console.log( `[${ tesInfObj.project.name }] ${ staIdeStr } needs review:\n  ${ revLinArr.join( '\n  ' ) }` ); // What: Review Log Call. Why: The terminal run should show what needs a look without opening the report. How: This prints the state's review lines under its project and name.



	expect( sumResFun( axeResObj.violations ) ).toEqual( [] ); // What: No Violations Assertion. Why: The state passes only with zero violations. How: This compares the summarized violations with an empty list, so a failure prints each one.


}

// #endregion scaRepFun

// #endregion Helpers



// #region Module Init

for ( const staRecObj of STA_REC_ARR ) { // What: State Test Loop. Why: Every page state must pass the scan. How: This declares one axe test per state.


	test( `${ staRecObj.ideStr } has no axe violations`, async ( { page : curPagObj }, tesInfObj ) => { // What: Axe Test. Why: A state passes only with zero axe violations. How: This opens the state, then checks a scan of it finds no violations, reporting anything needing review.


		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The scan should see the state settled. How: This loads and settles it.

		await scaRepFun( curPagObj, tesInfObj, staRecObj.ideStr ); // What: Scan Report Call. Why: The state passes only with zero violations. How: This scans it, reports anything needing review, and fails on any violation.


	} );


}



for ( const resRecObj of FOR_RES_ARR ) { // What: Form Result Test Loop. Why: The form's results bring text and colors no page state shows, so each must pass the scan too. How: This declares one axe test per result.


	test( `${ resRecObj.ideStr } has no axe violations`, async ( { page : curPagObj }, tesInfObj ) => { // What: Form Result Axe Test. Why: The thank-you message and the error must be as accessible as the page. How: This sends the form against the faked answer, waits for the result to settle, then checks a scan of it finds no violations, reporting anything needing review.


		await fakNetFun( curPagObj, resRecObj.codNum ); // What: Netlify Fake Call. Why: The result depends on Netlify's answer, and no real request should go out. How: This answers every post to the site's root with the row's status.

		await opeStaFun( curPagObj, STA_REC_ARR.find( ( staRecObj ) => staRecObj.ideStr === 'home-desktop' )! ); // What: Home Desktop Open Call. Why: The form lives in the Contact section, scanned at desktop width. How: This loads and settles the home page at 1,440px. // What: Non-Null Note. Why: find types its result as possibly undefined. How: STA_REC_ARR always holds the home-desktop state.

		await curPagObj.getByLabel( 'Full Name *' ).fill( 'Test Visitor' ); // What: Name Fill Call. Why: The name is required. How: This types a name.
		await curPagObj.getByLabel( 'Phone *' ).fill( '(785) 555-0100' );   // What: Phone Fill Call. Why: The phone number is required. How: This types a number from the reserved 555-01xx range.

		await curPagObj.getByRole( 'button', { name : 'Submit Free Quote Request' } ).click(); // What: Submit Click Call. Why: The result only shows after a send. How: This sends the request, which the fake answers.

		await expect( curPagObj.getByText( resRecObj.texStr ) ).toBeVisible(); // What: Result Shown Assertion. Why: The scan has to see the result, not the form before the answer arrives. How: This waits for the row's text.

		await waiSetFun( curPagObj ); // What: Settled Page Wait. Why: Contrast measured mid-fade would be wrong. How: This waits until the result has finished fading in.

		await scaRepFun( curPagObj, tesInfObj, resRecObj.ideStr ); // What: Scan Report Call. Why: The result passes only with zero violations. How: This scans it, reports anything needing review, and fails on any violation.


	} );


}

// #endregion Module Init


