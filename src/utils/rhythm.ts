


/**
 * rhythm.ts = Rhythm
 *
 * @summary
 * The design scale's numbers for JavaScript that can't read the stylesheet's
 * tokens, such as an observer option: any power of the core design number as
 * a plain number, the counterpart of the stylesheet's --cdn-pow-* tokens and
 * their reciprocals, computed with the same formula as styles.css's
 * --cor-des-num, so a value read here always matches the stylesheet's own.
 * Adapted from tech-geek-cards.
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

// #endregion Helpers



// #region Exports

export { cdnPowFun }; // What: Named Export. Why: JavaScript that needs a value on the scale reads it here rather than as a free-standing literal. How: This exports cdnPowFun.

// #endregion Exports


