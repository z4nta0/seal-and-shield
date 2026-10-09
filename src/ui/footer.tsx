


// #region Imports

import cssModObj from './footer.module.css';        // What: CSS Module Object. Why: The footer is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.
import losPngUrl from '../assets/logo-simple.png'; // What: Logo-Simple PNG URL. Why: The footer's brand opens with the simple mark. How: Vite resolves this to the image's fingerprinted URL, which the brand's img element loads.


import { useSecLinFun } from './section-link.ts'; // What: Use Section Link Function. Why: Section buttons have to work from every page, not only the home page. How: This returns the function that scrolls to a section or navigates home to it.

// #endregion Imports



/**
 * footer.tsx = Footer
 *
 * @summary
 * The site's footer: the brand and tagline, a button for each section that
 * takes the visitor to it from any page, the phone number and business hours, and the copyright
 * line with the current year. Its nav landmark is labelled Footer, telling
 * it apart from the bar's.
 *
 * Sections:
 *  - Constants
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const FOO_SEC_ARR = [ 'home', 'services', 'about', 'contact' ]; // What: Footer Section Array. Why: The footer offers a button for each section, in page order. How: Each entry is a section's id, which its button goes to and capitalizes as its label.

// #endregion Constants



// #region Components

// #region SitFooCom

/**
 * SitFooCom = Site Footer Component
 *
 * @summary
 * Renders the footer. Each section button reaches its section through
 * section-link.ts, scrolling in place on the home page, smoothly unless the
 * visitor asked for reduced motion, or navigating home from any other page,
 * and is labelled with the section's id capitalized. The copyright line reads the current year each
 * time the footer renders, so it never goes stale.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The footer element.
 *
 * @example
 * ```tsx
 * SitFooCom() // => <SitFooCom />
 * ```
 *
*/

function SitFooCom () : React.JSX.Element {


	const curYeaNum = new Date().getFullYear(); // What: Current Year Number. Why: The copyright line names the current year. How: This reads it from today's date.



	const goSecFun = useSecLinFun(); // What: Go Section Function. Why: Each section button takes the visitor to its section from any page. How: This scrolls to the section on the home page, or navigates home to it from anywhere else.



	return (


		<footer className={ cssModObj.sitFooFoo }>{ /* What: Site Footer Footer Element. Why: The page ends with the company's details and a way back to each section. How: This holds the footer's columns and its copyright line. */ }


			<div className={ cssModObj.fooInnDiv }>{ /* What: Footer Inner Div Element. Why: The footer's columns line up with the page's content width. How: This lays out the brand, the section buttons, and the contact details across a centered, capped-width row. */ }


				<div className={ cssModObj.fooBraDiv }>{ /* What: Footer Brand Div Element. Why: The mark, name, and tagline read as one block. How: This sets the mark beside the two lines of text. */ }


					<img
						className={ cssModObj.fooLogIma }

						height={ 133 }
						src={ losPngUrl }
						width={ 157 } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.

						alt=''
					/>{ /* What: Footer Logo Image Element. Why: The footer's brand opens with the simple mark. How: Its alt text is empty, since the brand name sits right beside it. */ }

					<div>{ /* What: Footer Brand Text Div Element. Why: The name and tagline stack beside the mark. How: This holds the two lines. */ }


						<p className={ cssModObj.braNamPar }>Seal and Shield LLC</p>{ /* What: Brand Name Paragraph Element. Why: The footer names the company by its legal name. How: This shows it in the display font. */ }

						<p className={ cssModObj.braTagPar }>Commercial Roofing in Lawrence, Kansas</p>{ /* What: Brand Tagline Paragraph Element. Why: The tagline says what the company does and where. How: This shows it beneath the name. */ }


					</div>


				</div>



				<nav
					className={ cssModObj.fooLinNav }

					aria-label='Footer'
				>{ /* What: Footer Links Nav Element. Why: Visitors at the bottom of the page can jump back to any section. How: This labels the landmark Footer, telling it apart from the bar's. */ }


					{ FOO_SEC_ARR.map( ( secIdeStr ) => ( // What: Section Button Map. Why: Each section gets a button. How: This renders one button per section id.


						<button
							key={ secIdeStr }

							className={ cssModObj.fooLinBut }

							onClick={ () => goSecFun( secIdeStr ) }
						>{ /* What: Footer Link Button Element. Why: Each button scrolls to its section. How: This calls goSecFun with the section's id. */ }
							{ secIdeStr.charAt( 0 ).toUpperCase() + secIdeStr.slice( 1 ) }{ /* What: Section Label Expression. Why: The button names its section. How: This capitalizes the section id's first letter. */ }
						</button>


					))}


				</nav>

				<div className={ cssModObj.fooConDiv }>{ /* What: Footer Contact Div Element. Why: The phone number and hours close the footer's columns. How: This stacks the two. */ }


					<a
						className={ cssModObj.fooPhoAnc }

						href='tel:7853041957'
					>{ /* What: Footer Phone Anchor Element. Why: Calling is the fastest way to reach the company. How: This dials its number on phones. */ }
						(785) 304-1957
					</a>

					<p className={ cssModObj.fooHouPar }>Mon – Fri &nbsp;|&nbsp; 8 a.m. – 5 p.m.</p>{ /* What: Footer Hours Paragraph Element. Why: Callers should know when someone will answer. How: This lists the weekday business hours. */ }


				</div>


			</div>



			<div className={ cssModObj.fooBotDiv }>{ /* What: Footer Bottom Div Element. Why: The copyright line sits apart from the columns, across the footer's full width. How: This holds it below a hairline. */ }


				<p className={ cssModObj.fooCopPar }>© { curYeaNum } Seal and Shield LLC. All rights reserved. Lawrence, Kansas.</p>{ /* What: Footer Copyright Paragraph Element. Why: The copyright line names the year and the company's legal name. How: This prints the current year read on each render. */ }


			</div>


		</footer>


	);


}

// #endregion SitFooCom

// #endregion Components



// #region Exports

export { SitFooCom }; // What: Named Exports. Why: The home page renders the footer below its content. How: This exports SitFooCom.

// #endregion Exports


