


/**
 * motion.ts = Motion
 *
 * @summary
 * The reduced-motion check that motion JavaScript plays itself consults
 * before playing: whether the visitor's operating system asks for reduced
 * motion. CSS motion is turned off by each stylesheet's own media query, but
 * a smooth scroll started from JavaScript never sees that query, so it asks
 * here instead. It reads the live media query each time, so a change to the
 * setting takes effect without a reload. Adapted from ease-my-life's own.
 *
 * Sections:
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

// #region redMotFun

/**
 * redMotFun = Reduce Motion Function
 *
 * @summary
 * Whether the visitor asked their system for reduced motion. JS-driven
 * motion (here, the smooth scrolls behind the section links and buttons)
 * checks this, since the CSS media query alone can't stop it. It reads the
 * live setting on every call, so a change takes effect immediately.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns Whether reduced motion is requested.
 *
 * @example
 * ```ts
 * redMotFun() // => true or false
 * ```
 *
*/

const redMotFun = () : boolean => !!( window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ); // What: Reduce Motion Function. Why: JS-driven motion such as a smooth scroll must check this, since the CSS media query alone never reaches it. How: This reports whether the system's prefers-reduced-motion media query currently matches reduce.

// #endregion redMotFun

// #endregion Helpers



// #region Exports

export { redMotFun }; // What: Named Export. Why: Every smooth scroll checks the same reduced-motion preference. How: This exports redMotFun by name.

// #endregion Exports


