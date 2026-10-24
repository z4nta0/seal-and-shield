


/**
 * rhythm.ts = Rhythm
 *
 * @summary
 * The design scale for JavaScript. Any power of the core design number as a
 * plain number, for a value the stylesheet's tokens can't reach, such as an
 * observer option: the counterpart of the --cdn-pow-* tokens and their
 * reciprocals, computed with the same formula as styles.css's --cor-des-num,
 * so a value read here always matches the stylesheet's own. And any length
 * token's size in pixels, read from the page itself, for a distance that has
 * to clear something the stylesheet sizes. Adapted from tech-geek-cards.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const COR_DES_NUM = ( Math.cbrt( 108 + 12 * Math.sqrt( 69 ) ) + Math.cbrt( 108 - 12 * Math.sqrt( 69 ) ) ) / 6; // What: Core Design Number. Why: Every value on the scale is a power of the plastic ratio, the same core design number styles.css starts from. How: This solves for it with the same cube-root formula as the stylesheet's --cor-des-num, about 1.325.

// #endregion Constants



// #region Helpers

// #region cdnPowFun

/**
 * cdnPowFun = Core-Design-Number Power Function
 *
 * @summary
 * Any power of the core design number as a plain number, the JavaScript
 * counterpart of the stylesheet's --cdn-pow-* tokens. A negative power gives
 * a reciprocal, the counterpart of a --cdn-pow-*-rec token, for a fraction
 * such as an observer's threshold that sits on the scale.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param powValNum - Power Value Number: The power to raise the core design
 *                    number to, e.g. 15, or -8 for the 8th reciprocal.
 *
 * @returns The core design number raised to that power.
 *
 * @example
 * ```ts
 * cdnPowFun(-8) // => about 0.105
 * ```
 *
*/

const cdnPowFun = ( powValNum : number ) : number => Math.pow( COR_DES_NUM, powValNum ); // What: Core-Design-Number Power Function. Why: A number with no named step still sits on the scale as a power of the core design number, like the stylesheet's --cdn-pow-* tokens. How: This raises the core design number to the given power.

// #endregion cdnPowFun



// #region tokPxlFun

/**
 * tokPxlFun = Token Pixel Function
 *
 * @summary
 * A length token's size in pixels, as the page itself resolves it, for a
 * distance JavaScript works out that has to clear something the stylesheet
 * sizes, such as the space below a fixed bar. A custom property read from a
 * computed style comes back as its unresolved text, so this sizes a hidden
 * probe element by the token, reads the height the browser gives it, and
 * removes the probe again. It follows any root font size a visitor sets,
 * the same as the stylesheet does.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param tokNamStr - Token Name String: The length token's name, with its
 *                    leading dashes, e.g. '--nav-bar-hei'.
 *
 * @returns The token's size in pixels.
 * @see {@link tokHeiNum}
 *
 * @example
 * ```ts
 * tokPxlFun('--nav-bar-hei') // => about 83.483
 * ```
 *
*/

const tokPxlFun = ( tokNamStr : string ) : number => { // What: Token Pixel Function. Why: A distance in JavaScript should read the same token the stylesheet sizes the thing it clears with. How: This resolves the token through a hidden probe's height.


	const proCurEle = document.createElement( 'div' ); // What: Probe Current Element. Why: Only a laid-out element resolves a token to pixels. How: This creates an empty div to size by the token.


	proCurEle.style.cssText = `height : var( ${ tokNamStr } ); position : absolute; visibility : hidden;`; // What: Probe Style Text. Why: The probe takes the token as its height without showing or moving anything. How: This sets the height from the token, takes the probe out of the flow, and hides it.


	document.body.appendChild( proCurEle ); // What: Probe Attach Call. Why: The browser resolves the token only once the probe is in the page. How: This adds it to the body.


	const tokHeiNum = proCurEle.getBoundingClientRect().height; // What: Token Height Number. Why: The probe's height is the token's size in pixels. How: This reads the height the browser laid out.


	proCurEle.remove(); // What: Probe Removal Call. Why: The probe was only there to be measured. How: This takes it back out of the page.



	return tokHeiNum; // What: Token Height Number Return. Why: The caller works in pixels. How: This hands back the probe's measured height.


};

// #endregion tokPxlFun

// #endregion Helpers



// #region Exports

export { cdnPowFun, tokPxlFun }; // What: Named Exports. Why: JavaScript that needs a value on the scale, or the size of a length token, reads it here rather than as a free-standing literal. How: This exports cdnPowFun and tokPxlFun.

// #endregion Exports


