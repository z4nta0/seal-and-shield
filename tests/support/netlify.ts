


// #region Imports

import type { Page } from '@playwright/test'; // What: Page. Why: The fake answers a Playwright page's posts. How: This types fakNetFun's page parameter.

// #endregion Imports



/**
 * netlify.ts = Netlify
 *
 * @summary
 * The stand-in for Netlify Forms that the interaction and accessibility
 * suites share, so a form check can see the page react to Netlify's answer
 * without sending anything. fakNetFun answers every post to the site's root
 * address in the browser with a chosen status and counts them, and lets every
 * other request through.
 *
 * Sections:
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



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



	return posCouObj; // What: Post Count Return. Why: Some tests check how many requests went out. How: This hands back the counter the route handler updates.


}

// #endregion fakNetFun

// #endregion Helpers



// #region Exports

export { fakNetFun }; // What: Named Export. Why: The interaction and accessibility suites both fake Netlify's answer. How: This exports the helper that does it.

// #endregion Exports


