


// #region Imports

import { expect      } from '@playwright/test';     // What: Expect. Why: Each state passes only when it matches its approved screenshot. How: This compares the page with its baseline.
import { opeStaFun   } from '../support/states.ts'; // What: Open State Function. Why: Each state is captured settled. How: This loads it and waits for it.
import { STA_RCD_ARR } from '../support/states.ts'; // What: State Record Array. Why: Every page state gets a baseline. How: This lists them.
import { test        } from '@playwright/test';     // What: Test. Why: Each state is its own comparison. How: This declares them.

// #endregion Imports



/**
 * screens.spec.ts = Screens Spec
 *
 * @summary
 * Compares a full-page screenshot of every page state with its approved
 * baseline, in whichever engine the project runs, so a change that shifts
 * the layout or the styling anywhere on a page fails until it's looked at.
 * Each state opens under reduced motion and is captured with animations
 * stopped, so it's always caught at rest, and the footer's copyright year is
 * masked, so the baselines don't fail every January. Baselines live in
 * tests/rendering/baselines, one per state and engine, captured on Linux;
 * another system's font rendering would differ, so baselines are refreshed
 * on the machine that runs the suite. When a change is meant to alter how a
 * page looks, review the failing diff in the report, then refresh the
 * baselines with npm run test:rendering -- --update-snapshots and commit them
 * with the change.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const MAX_DIF_NUM = 0; // What: Maximum Difference Number. Why: Each engine renders a state identically from run to run on the machine that captured its baseline, and even a small tolerance can hide a real change, as it once hid the nav links moving. How: This fails a comparison on any differing pixel.

// #endregion Constants



// #region Module Init

for ( const staRcdObj of STA_RCD_ARR ) { // What: State Test Loop. Why: Every page state has a baseline. How: This declares one comparison per state.


	test( `${ staRcdObj.ideStr } matches its approved screenshot`, async ( { page : curPagObj } ) => { // What: Screenshot Test. Why: A page should only change how it looks on purpose. How: This opens the state at rest and compares it with its baseline.


		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Entrance animations would otherwise be caught partway. How: This makes the page match prefers-reduced-motion, which turns them off.

		await opeStaFun( curPagObj, staRcdObj ); // What: State Open Call. Why: The state is captured settled. How: This loads and settles it.


		await expect( curPagObj ).toHaveScreenshot( `${ staRcdObj.ideStr }.png`, { animations : 'disabled', fullPage : true, mask : [ curPagObj.getByRole( 'contentinfo' ).getByText( /©/ ) ], maxDiffPixelRatio : MAX_DIF_NUM } ); // What: Baseline Comparison Assertion. Why: The state should look exactly as approved. How: This captures the whole page with animations stopped and the copyright year masked, and compares it with the state's baseline.


	} );


}

// #endregion Module Init


