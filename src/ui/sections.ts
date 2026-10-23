


/**
 * sections.ts = Sections
 *
 * @summary
 * The home page's sections in page order, the one list every part of the
 * site that names them reads: the bar's links, the mobile menu's links, the
 * bar's tracking of the section being read, and the footer's links. Adding,
 * renaming, or moving a section means changing this list alone.
 *
 * Sections:
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

// #region SEC_LIN_ARR

/**
 * SEC_LIN_ARR = Section Link Array
 *
 * @summary
 * The home page's sections, in page order, as the links to them read. Every
 * row shares one shape, so its fields carry no comments of their own:
 *
 * - `ideStr` (String): Identifier String, the section's id, which a link's
 *   href names on the home page's path, e.g. /#about.
 *
 * - `labStr` (String): Label String, the link's visible text.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const SEC_LIN_ARR = [ // What: Section Link Array. Why: The bar, the menu, and the footer link to the same sections, and the bar tracks which one is being read, so the list is defined once. How: Each row pairs a section's id with its link's label, in page order.


	{ ideStr : 'home',     labStr : 'Home'     }, // What: Home Link Row. Why: Visitors need a way back to the top. How: This links to the hero section.
	{ ideStr : 'services', labStr : 'Services' }, // What: Services Link Row. Why: The services are the site's main content. How: This links to the Services section.
	{ ideStr : 'about',    labStr : 'About'    }, // What: About Link Row. Why: Visitors check who they'd be hiring. How: This links to the About section.
	{ ideStr : 'contact',  labStr : 'Contact'  }  // What: Contact Link Row. Why: The page's goal is a quote request. How: This links to the Contact section.


];

// #endregion SEC_LIN_ARR

// #endregion Constants



// #region Exports

export { SEC_LIN_ARR }; // What: Named Export. Why: The bar and the footer both link to the home page's sections. How: This exports the one list of them, in page order.

// #endregion Exports


