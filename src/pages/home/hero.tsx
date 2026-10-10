


// #region Imports

import cssModObj from './hero.module.css'; // What: CSS Module Object. Why: The hero is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.
import lofWebUrl from './logo-full.webp';  // What: Logo-Full WebP URL. Why: The hero's right column shows the full logo. How: Vite resolves this to the image's fingerprinted URL, which the logo's img element loads.


import { redMotFun } from '../../utils/motion.ts'; // What: Reduce Motion Function. Why: The hero's buttons scroll smoothly, which has to respect the reduced-motion preference. How: scrSecFun asks it before choosing the scroll behavior.

// #endregion Imports



/**
 * hero.tsx = Hero
 *
 * @summary
 * The page's opening section: an eyebrow, the "Built to Seal. Built to
 * Shield." headline, a short pitch, and two buttons, one scrolling to the
 * quote form and one to the services, beside the full logo with its pulsing
 * ring, over a background grid and glow. A stats bar along its bottom sums
 * up the company in four figures. Its id, home, is what the bar's Home link
 * and brand scroll to.
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

/**
 * HER_STA_ARR = Hero Stat Array
 *
 * @summary
 * The four figures in the hero's stats bar, in display order. Every row
 * shares one shape, so its fields carry no comments of their own:
 * - `labStr` (String): Label String, the small caption under the figure,
 *   which also serves as the row's React key.
 * - `valStr` (String): Value String, the figure itself.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const HER_STA_ARR = [ // What: Hero Stat Array. Why: The stats bar sums the company up in four quick figures. How: Each row pairs a figure with its caption.


	{ labStr : 'Commercial Focus',     valStr : '100%'    }, // What: Commercial Focus Stat Row. Why: The company works on commercial roofs only. How: This shows 100%.
	{ labStr : 'Inspections & Quotes', valStr : 'Free'    }, // What: Free Quotes Stat Row. Why: A free inspection lowers the bar to getting in touch. How: This shows Free.
	{ labStr : 'Service Coverage',     valStr : 'KS + US' }, // What: Service Coverage Stat Row. Why: Visitors outside Lawrence want to know they're covered. How: This shows Kansas plus the continental U.S.
	{ labStr : 'Founded in Lawrence',  valStr : '2024'    }  // What: Founded Stat Row. Why: The founding year and town ground the company locally. How: This shows 2024.


];

// #endregion Constants



// #region Components

// #region HerSecCom

/**
 * HerSecCom = Hero Section Component
 *
 * @summary
 * Renders the hero section. Its two buttons are real links to the contact
 * and services sections, so they work without JavaScript, but a click goes
 * through scrSecFun, which scrolls to the section in place, smoothly unless
 * the visitor asked for reduced motion. The background grid, glow, and the
 * logo's ring are decorative and hidden from assistive technology.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The hero's section element.
 *
 * @example
 * ```tsx
 * HerSecCom() // => <HerSecCom />
 * ```
 *
*/

function HerSecCom () : React.JSX.Element {


	// #region scrSecFun

	/**
	 * scrSecFun = Scroll Section Function
	 *
	 * @summary
	 * Handles a click on either hero button: stops the browser's own jump to
	 * the link's hash and scrolls to the section with the given id instead,
	 * smoothly unless the visitor asked for reduced motion, in which case it
	 * jumps.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param cliEveObj - Click Event Object: The button's click event.
	 * @param secIdeStr - Section Identifier String: The id of the section to
	 *                    scroll to, e.g. 'contact'.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * scrSecFun(cliEveObj, 'contact') // => void
	 * ```
	 *
	*/

	const scrSecFun = ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Scroll Section Function. Why: Both hero buttons scroll in place instead of jumping. How: This cancels the jump and scrolls to the section.


		cliEveObj.preventDefault(); // What: Default Jump Cancel. Why: The browser would otherwise jump to the hash instantly and skip the smooth scroll. How: This stops the link's own navigation.

		document.getElementById( secIdeStr )?.scrollIntoView( { behavior : redMotFun() ? 'auto' : 'smooth' } ); // What: Section Scroll Call. Why: The visitor should land on the section the button names. How: This scrolls it into view, jumping instead of gliding under reduced motion.


	};

	// #endregion scrSecFun



	return (


		<section
			id='home'

			className={ cssModObj.homHerSec }
		>{ /* What: Home Hero Section Element. Why: The page opens with the headline, pitch, and logo. How: Its id, kept as is because it's the bar's link target, is where the Home link and brand scroll to. */ }


			<div
				className={ cssModObj.herGriDiv }

				aria-hidden='true'
			/>{ /* What: Hero Grid Div Element. Why: A faint grid gives the dark hero some texture. How: This is decorative and hidden from assistive technology. */ }

			<div
				className={ cssModObj.herGraDiv }

				aria-hidden='true'
			/>{ /* What: Hero Gradient Div Element. Why: A soft glow draws the eye toward the logo. How: This is decorative and hidden from assistive technology. */ }



			<div className={ cssModObj.herConDiv }>{ /* What: Hero Content Div Element. Why: The hero's text and logo line up with the page's content width. How: This lays them out in two columns. */ }


				<div>{ /* What: Hero Left Div Element. Why: The pitch reads first. How: This stacks the eyebrow, headline, pitch, and buttons as the content grid's first column, with no styling of its own. */ }


					<h1>{ /* What: Hero Title Heading Element. Why: The page's main heading should carry what the company does and where, the words local searches look for, as well as its promise. How: This holds the two-line eyebrow and the slogan, each styled as its own block, so the heading reads as one while looking as it always has. */ }


						<span className={ cssModObj.eyeLabSpa }>{ /* What: Eyebrow Label Span Element. Why: A short label says what the company is and where before the slogan. How: This sets the specialty and the city on two lines in small capitals. */ }
							Commercial Roofing Specialists<br />
							Lawrence, KS
						</span>

						<span className={ cssModObj.herSloSpa }>{ /* What: Hero Slogan Span Element. Why: The slogan is the company's promise, set large. How: Its two accent words take the light blue. */ }
							Built to<br />
							<span className={ cssModObj.titAccSpa }>Seal.</span>{ /* What: Seal Accent Span Element. Why: The first promise word stands out. How: This colors it light blue. */ }{ ' ' }
							Built to<br />
							<span className={ cssModObj.titAccSpa }>Shield.</span>{ /* What: Shield Accent Span Element. Why: The second promise word stands out. How: This colors it light blue. */ }
						</span>


					</h1>

					<p className={ cssModObj.herLedPar }>{ /* What: Hero Lede Paragraph Element. Why: A short pitch follows the headline. How: This names the company's range of work and its promise. */ }
						Protecting Kansas businesses with premium roofing solutions,
						from Conklin liquid coatings to full commercial installations.
						Trusted, reliable, and built to last.
					</p>

					<div className={ cssModObj.herActDiv }>{ /* What: Hero Actions Div Element. Why: The pitch ends with the two next steps. How: This sets the two buttons side by side. */ }


						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

							href='#contact'

							onClick={ ( cliEveObj ) => scrSecFun( cliEveObj, 'contact' ) }
						>{ /* What: Hero Quote Anchor Element. Why: Requesting a quote is the page's main goal. How: This scrolls to the contact section. */ }
							Get a Free Quote
						</a>

						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncSecondary } `}

							href='#services'

							onClick={ ( cliEveObj ) => scrSecFun( cliEveObj, 'services' ) }
						>{ /* What: Hero Services Anchor Element. Why: Some visitors want to see what's offered first. How: This scrolls to the services section. */ }
							Our Services
						</a>


					</div>


				</div>


				<div className={ cssModObj.herRigDiv }>{ /* What: Hero Right Div Element. Why: The logo balances the pitch. How: This centers the logo and its ring. */ }


					<div className={ cssModObj.herLogDiv }>{ /* What: Hero Logo Div Element. Why: The ring sits behind the logo. How: This stacks the two in one box. */ }


						<div
							className={ cssModObj.logRinDiv }

							aria-hidden='true'
						/>{ /* What: Logo Ring Div Element. Why: A slow pulse around the logo adds a little life. How: This is decorative, hidden from assistive technology, and still under reduced motion. */ }

						<img
							className={ cssModObj.herLogIma }

							height={ 943 }
							src={ lofWebUrl }
							width={ 968 } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.

							alt='Seal and Shield LLC Logo'
						/>{ /* What: Hero Logo Image Element. Why: The full logo anchors the hero. How: Its alt text repeats the name the image shows. */ }


					</div>


				</div>


			</div>



			<div className={ cssModObj.herStaDiv }>{ /* What: Hero Stats Div Element. Why: Four quick figures close the hero. How: This draws the bar along the hero's bottom. */ }


				<div className={ cssModObj.staInnDiv }>{ /* What: Stats Inner Div Element. Why: The figures line up with the page's content width. How: This lays the four out in a row. */ }


					{ HER_STA_ARR.map( ( staRcdObj ) => ( // What: Stat Map. Why: Each figure gets its own cell. How: This renders one cell per row.


						<div
							key={ staRcdObj.labStr }

							className={ cssModObj.staIteDiv }
						>{ /* What: Stat Item Div Element. Why: Each figure reads with its caption. How: This stacks the two. */ }


							<span className={ cssModObj.staValSpa }>{ staRcdObj.valStr }</span>{ /* What: Stat Value Span Element. Why: The figure is the cell's focus. How: This shows it large. */ }

							<span className={ cssModObj.staLabSpa }>{ staRcdObj.labStr }</span>{ /* What: Stat Label Span Element. Why: The caption says what the figure means. How: This shows it small beneath. */ }


						</div>


					))}


				</div>


			</div>


		</section>


	);


}

// #endregion HerSecCom

// #endregion Components



// #region Exports

export { HerSecCom }; // What: Named Exports. Why: The home page renders the hero first. How: This exports HerSecCom.

// #endregion Exports


