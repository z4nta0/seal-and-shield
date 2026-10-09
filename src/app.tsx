


// #region Imports

import cssModObj from './app.module.css'; // What: CSS Module Object. Why: The root wrapper's container styles live in its own module. How: This reads the scoped class name for the root div.


import { HomPagCom } from './pages/home/home.tsx';           // What: Home Page Component. Why: The home page holds every section of the site. How: The root path's route renders it.
import { NotFouCom } from './pages/not-found/not-found.tsx'; // What: Not Found Component. Why: Unknown paths need a page of their own. How: The catch-all route renders it.
import { Route     } from 'react-router';                    // What: Route. Why: Each page is matched to a path. How: This declares one path and the page it renders.
import { Routes    } from 'react-router';                    // What: Routes. Why: Only one page should render for any path. How: This renders the first route whose path matches.

// #endregion Imports



/**
 * app.tsx = App
 *
 * @summary
 * The site's root component, mounted by main.tsx inside the router. It
 * renders the route table inside the app container the layout queries
 * measure: the home page at the root path and the 404 page for every other
 * path.
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
 * The top of the component tree: renders the site's route table inside the
 * app container that every module's layout queries measure, so whichever
 * page matches the current path is the one on screen: the home page at the
 * root path, and the 404 page for anything else.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The page matching the current path, inside the app container.
 *
 * @example
 * ```tsx
 * AppRooCom() // => <AppRooCom />
 * ```
 *
*/

function AppRooCom () : React.JSX.Element {


	return (


		<div className={ cssModObj.appRooDiv }>{ /* What: App Root Div Element. Why: Every module's layout queries measure one shared container. How: This wraps the routes in the element named the app container. */ }


			<Routes>{ /* What: Routes. Why: Only one page should render for any path. How: This renders the first route below whose path matches. */ }


				<Route
					element={ <HomPagCom /> }
					path='/'
				/>{ /* What: Home Route. Why: The site's root address is its home page. How: This renders HomPagCom at the root path. */ }



				<Route
					element={ <NotFouCom /> }
					path='*' // What: Catch-All Path. Why: Any address the site doesn't have should land on the 404 page. How: The asterisk matches every path no earlier route claimed.
				/>{ /* What: Not Found Route. Why: Unknown paths need a page of their own. How: This renders NotFouCom for every other path. */ }


			</Routes>


		</div>


	);


}

// #endregion AppRooCom

// #endregion Components



// #region Exports

export { AppRooCom }; // What: Named Exports. Why: main.tsx is the sole consumer, mounting this as the site's root. How: This exports AppRooCom.

// #endregion Exports


