


// #region Imports

import cssModObj from './app.module.css'; // What: CSS Module Object. Why: The root wrapper's container styles live in its own module. How: This reads the scoped class name for the root div.


import { HomPagCom } from './pages/home/home.tsx'; // What: Home Page Component. Why: The home page holds every section of the site. How: This is rendered as the site's root.

// #endregion Imports



/**
 * app.tsx = App
 *
 * @summary
 * The site's root component, mounted by main.tsx inside the router. The site
 * has one page so far, so it renders the home page directly inside the app
 * container the layout queries measure; the routes for the home page and a
 * 404 page join here once the 404 page is built.
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
 * site has until the 404 page and its routes arrive, inside the app
 * container that every module's layout queries measure.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The home page inside the app container.
 *
 * @example
 * ```tsx
 * AppRooCom() // => <AppRooCom />
 * ```
 *
*/

function AppRooCom () : React.JSX.Element {


	return (


		<div className={ cssModObj.appRooDiv }>{ /* What: App Root Div Element. Why: Every module's layout queries measure one shared container. How: This wraps the page in the element named the app container. */ }


			<HomPagCom />{ /* What: Home Page Component. Why: The site has a single page for now. How: This renders the home page inside the app container. */ }


		</div>


	);


}

// #endregion AppRooCom

// #endregion Components



// #region Exports

export { AppRooCom }; // What: Named Exports. Why: main.tsx is the sole consumer, mounting this as the site's root. How: This exports AppRooCom.

// #endregion Exports


