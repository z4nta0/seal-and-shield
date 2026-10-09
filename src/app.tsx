


// #region Imports

import { HomPagCom } from './pages/home/home.tsx'; // What: Home Page Component. Why: The home page holds every section of the site. How: This is rendered as the site's root.

// #endregion Imports



/**
 * app.tsx = App
 *
 * @summary
 * The site's root component, mounted by main.tsx inside the router. The site
 * has one page so far, so it renders the home page directly; the routes for
 * the home page and a 404 page join here once the 404 page is built.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region AppRooCom

/**
 * AppRooCom = App Root Component
 *
 * @summary
 * The top of the component tree: renders the home page, the only page the
 * site has until the 404 page and its routes arrive.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The home page.
 *
 * @example
 * ```tsx
 * AppRooCom() // => <AppRooCom />
 * ```
 *
*/

function AppRooCom () : React.JSX.Element {


	return <HomPagCom />; // What: Home Page Return. Why: The site has a single page for now. How: This renders HomPagCom as the whole app.


}

// #endregion AppRooCom

// #endregion Components



// #region Exports

export { AppRooCom }; // What: Named Exports. Why: main.tsx is the sole consumer, mounting this as the site's root. How: This exports AppRooCom.

// #endregion Exports


