


// #region Imports

import cssModObj from './hero.module.css'; // What: CSS Module Object. Why: The hero is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.
import lofWebUrl from './logo-full.webp';  // What: Logo-Full WebP URL. Why: The hero shows the full logo. How: Vite resolves this to the image's fingerprinted URL, which the logo's img element loads.


import { useSecCliFun } from '../../ui/section-link.ts'; // What: Use Section Click Function. Why: The hero's buttons reach their sections the same way every section link does. How: This returns secCliFun, which scrolls to the section and leaves a Ctrl, Cmd, Shift, or Alt click to the browser, while a middle click, sent as auxclick, never reaches the handler.

// #endregion Imports



/**
 * hero.tsx = Hero
 *
 * @summary
 * The page's opening section: an eyebrow, the "Built to Seal. Built to
 * Shield." headline, a short pitch, and two buttons, one scrolling to the
 * quote form and one to the Services section, beside the full logo with its
 * pulsing ring, over a background grid and glow. At 900px wide and below, the
 * text and logo become one centered column with the logo first. A stats bar
 * along the section's bottom sums up the company in four figures, set two by
 * two at 900px wide and below. The section's id, home, is what every Home link
 * and the bar's brand scroll to.
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

// #region HER_STA_ARR

/**
 * HER_STA_ARR = Hero Stat Array
 *
 * @summary
 * The four figures in the hero's stats bar, in display order. Every row
 * shares one shape, so its fields carry no comments of their own:
 *
 * - `labStr` (String): Label String, the small caption under the figure,
 *   which also serves as the row's React key.
 *
 * - `valStr` (String): Value String, the figure itself.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const HER_STA_ARR = [ // What: Hero Stat Array. Why: The stats bar sums the company up in four quick figures. How: Each row pairs a figure with its caption.


	{ labStr : 'Commercial Focus',     valStr : '100%'    }, // What: Commercial Focus Stat Row. Why: The company works on commercial roofs only. How: This shows 100%.
	{ labStr : 'Inspections & Quotes', valStr : 'Free'    }, // What: Inspections And Quotes Stat Row. Why: A free inspection lowers the bar to getting in touch. How: This shows Free.
	{ labStr : 'Service Coverage',     valStr : 'KS + US' }, // What: Service Coverage Stat Row. Why: Visitors outside Lawrence want to know they're covered. How: This shows Kansas plus the continental U.S.
	{ labStr : 'Founded in Lawrence',  valStr : '2024'    }  // What: Founded Stat Row. Why: The founding year and town ground the company locally. How: This shows 2024.


];

// #endregion HER_STA_ARR

// #endregion Constants



// #region Components

// #region HerSecCom

/**
 * HerSecCom = Hero Section Component
 *
 * @summary
 * Renders the hero section. Its two buttons are real links to the Contact and
 * Services sections (/#contact, /#services), so the browser can open, copy, or
 * show their address, and they open in a new tab on a Ctrl, Cmd, or middle
 * click, while a plain click goes through secCliFun, which scrolls smoothly to
 * the section in place. The background grid, glow, and the logo's ring are
 * decorative and hidden from assistive technology.
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


	const secCliFun = useSecCliFun(); // What: Section Click Function. Why: Both hero buttons take the visitor to their sections the way every section link does. How: This scrolls to the section in place and leaves a Ctrl, Cmd, Shift, or Alt click to the browser, while a middle click, sent as auxclick, never reaches the handler.



	return (


		<section
			id='home'

			className={ cssModObj.homHerSec }
		>{ /* What: Home Hero Section Element. Why: The page opens with the headline, pitch, and logo. How: Its id, kept as is because it's a link target, is where every Home link and the bar's brand scroll to. */ }


			<div
				className={ cssModObj.herGriDiv }

				aria-hidden='true'
			/>{ /* What: Hero Grid Div Element. Why: A faint grid gives the dark hero some texture. How: This is decorative and hidden from assistive technology. */ }

			<div
				className={ cssModObj.herGraDiv }

				aria-hidden='true'
			/>{ /* What: Hero Gradient Div Element. Why: A soft glow draws the eye toward the logo. How: This is decorative and hidden from assistive technology. */ }



			<div className={ cssModObj.herConDiv }>{ /* What: Hero Content Div Element. Why: The hero's text and logo line up with the page's content width. How: This lays them out in two columns, stacking them in one centered column with the logo first at 900px wide and below. */ }


				<div>{ /* What: Hero Text Div Element. Why: The pitch is the hero's message. How: This stacks the eyebrow, headline, pitch, and buttons as the content grid's first column, or below the logo at 900px wide and below, with no styling of its own. */ }


					<h1>{ /* What: Hero Title Heading Element. Why: The page's main heading should carry what the company does and where, the words local searches look for, as well as its promise. How: This holds the two-line eyebrow and the slogan, each styled as its own block, so the heading reads as one while looking as it always has. */ }


						<span className={ cssModObj.eyeLabSpa }>{ /* What: Eyebrow Label Span Element. Why: A short label says what the company is and where before the slogan. How: This sets the specialty and the city on two lines in uppercase. */ }
							Commercial Roofing Specialists<br />
							Lawrence, KS
						</span>

						<span className={ cssModObj.herSloSpa }>{ /* What: Hero Slogan Span Element. Why: The slogan is the company's promise, set large. How: Its two accent words take the light blue. */ }
							Built to<br />
							<span className={ cssModObj.titAccSpa }>Seal.</span>{ /* What: Title Accent Span Element. Why: The first promise word stands out. How: This colors it light blue. */ }{ ' ' }
							Built to<br />
							<span className={ cssModObj.titAccSpa }>Shield.</span>{ /* What: Title Accent Span Element. Why: The second promise word stands out. How: This colors it light blue. */ }
						</span>


					</h1>

					<p className={ cssModObj.herLedPar }>{ /* What: Hero Lede Paragraph Element. Why: A short pitch follows the headline. How: This names the company's range of work and its promise. */ }
						Protecting Kansas businesses with premium roofing solutions,
						from Conklin liquid coatings to full commercial installations.
						Trusted, reliable, and built to last.
					</p>

					<div className={ cssModObj.herActDiv }>{ /* What: Hero Actions Div Element. Why: The pitch ends with the two next steps. How: This sets the two buttons side by side, centered at 900px wide and below, wrapping onto two lines at about 349px wide and below. */ }


						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

							href='/#contact'

							onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'contact' ) }
						>{ /* What: Button Base Anchor Primary Element. Why: Requesting a quote is the page's main goal. How: This scrolls to the Contact section. */ }
							Get a Free Quote
						</a>

						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncSecondary } `}

							href='/#services'

							onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'services' ) }
						>{ /* What: Button Base Anchor Secondary Element. Why: Some visitors want to see what's offered first. How: This scrolls to the Services section. */ }
							Our Services
						</a>


					</div>


				</div>


				<div className={ cssModObj.herVisDiv }>{ /* What: Hero Visual Div Element. Why: The logo balances the pitch. How: This centers the logo and its ring in the content grid's second column, or above the pitch at 900px wide and below. */ }


					<div className={ cssModObj.herLogDiv }>{ /* What: Hero Logo Div Element. Why: The ring sits behind the logo. How: This stacks the two in one box. */ }


						<div
							className={ cssModObj.logRinDiv }

							aria-hidden='true'
						/>{ /* What: Logo Ring Div Element. Why: A slow pulse around the logo adds a little life. How: This is decorative and hidden from assistive technology. */ }

						<img
							className={ cssModObj.herLogIma }

							height={ 943 } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.
							src={ lofWebUrl }
							width={ 968 } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.

							alt='Seal and Shield LLC'
						/>{ /* What: Hero Logo Image Element. Why: The full logo anchors the hero. How: Its alt text repeats the name the image shows. */ }


					</div>


				</div>


			</div>



			<div className={ cssModObj.herStaDiv }>{ /* What: Hero Stats Div Element. Why: Four quick figures close the hero. How: This draws the bar along the hero's bottom. */ }


				<div className={ cssModObj.staInnDiv }>{ /* What: Stats Inner Div Element. Why: The figures line up with the page's content width. How: This lays the four out in a row, or two by two at 900px wide and below. */ }


					{ HER_STA_ARR.map( ( staRecObj ) => ( // What: Stat Map. Why: Each figure gets its own cell. How: This renders one cell per row.


						<div
							key={ staRecObj.labStr }

							className={ cssModObj.staIteDiv }
						>{ /* What: Stat Item Div Element. Why: Each figure reads with its caption. How: This stacks the two. */ }


							<span className={ cssModObj.staValSpa }>{ staRecObj.valStr }</span>{ /* What: Stat Value Span Element. Why: The figure is the cell's focus. How: This shows it large. */ }

							<span className={ cssModObj.staLabSpa }>{ staRecObj.labStr }</span>{ /* What: Stat Label Span Element. Why: The caption says what the figure means. How: This shows it small beneath. */ }


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

export { HerSecCom }; // What: Named Export. Why: The home page renders the hero first. How: This exports HerSecCom.

// #endregion Exports


