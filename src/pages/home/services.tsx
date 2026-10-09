


// #region Imports

import { useRevSecFun } from './reveal.ts'; // What: Use Reveal Section Function. Why: The section's header, cards, and service area fade in as they scroll into view. How: This returns the ref the section attaches, staggered 80ms per block.


import './services.css'; // What: Services Stylesheet Import. Why: The section's header, card grid, and service area are styled in their own stylesheet. How: This is imported purely for its side effect.

// #endregion Imports



/**
 * services.tsx = Services
 *
 * @summary
 * The page's second section: a header introducing the company, a grid of
 * cards for the eight services it offers, and a service area panel naming
 * where it works, with a tag for each area. Each block fades in as the
 * section scrolls into view. Its id, services, is what the bar's Services
 * link and the hero's Our Services button scroll to.
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

// #region SER_RCD_ARR

/**
 * SER_RCD_ARR = Service Record Array
 *
 * @summary
 * The services the card grid shows, in display order. Every row shares one
 * shape, so its fields carry no comments of their own:
 * - `desStr` (String): Description String, the card's paragraph.
 * - `icoStr` (String): Icon String, the emoji the card opens with.
 * - `titStr` (String): Title String, the card's heading, which also serves
 *   as the row's React key.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const SER_RCD_ARR = [ // What: Service Record Array. Why: The card grid lists every service the company offers. How: Each row holds a card's icon, title, and description.


	{ // What: Full Roof Installation Service Row. Why: A new roof is the company's largest job. How: This describes it on its card.


		icoStr : '🏗️',
		titStr : 'Full Roof Installation',

		desStr : 'Complete commercial roof installations built to last. We handle every phase, from tear-off and substrate prep to final coating application.'


	},

	{ // What: Patching And Repairs Service Row. Why: Most roofs need a repair long before a replacement. How: This describes it on its card.


		icoStr : '🔧',
		titStr : 'Patching & Repairs',

		desStr : 'Targeted commercial roof repairs that stop leaks and prevent further damage. We diagnose the problem and fix it right the first time.'


	},

	{ // What: Service Calls Service Row. Why: A leak needs someone on site to judge it. How: This describes it on its card.


		icoStr : '📞',
		titStr : 'Service Calls',

		desStr : 'If your roof is leaking but may not need a full replacement, we\'ll come out, assess the situation, and recommend the most cost-effective solution.'


	},

	{ // What: Free Inspections Service Row. Why: An inspection is the low-risk first step. How: This describes it on its card.


		icoStr : '🔍',
		titStr : 'Free Inspections',

		desStr : 'No-obligation roof inspections to assess the current condition of your commercial roof. Know exactly what you\'re working with before committing to anything.'


	},

	{ // What: Conklin Liquid Coatings Service Row. Why: The company is an authorized Conklin distributor. How: This describes it on its card.


		icoStr : '💧',
		titStr : 'Conklin Liquid Coatings',

		desStr : 'As an authorized Conklin distributor, we specialize in high-performance liquid roof coatings: seamless, reflective, and built for the Kansas climate.'


	},

	{ // What: TPO And EPDM Roofing Service Row. Why: Flat and low-slope commercial roofs mostly use these membranes. How: This describes it on its card.


		icoStr : '🛡️',
		titStr : 'TPO & EPDM Roofing',

		desStr : 'We install both TPO (thermoplastic polyolefin) and EPDM rubber roofing membranes: durable, low-maintenance solutions for flat and low-slope commercial roofs.'


	},

	{ // What: Spray Foam Sealing Service Row. Why: Foam seals awkward areas a membrane can't. How: This describes it on its card.


		icoStr : '🌀',
		titStr : 'Spray Foam Sealing',

		desStr : 'Closed-cell spray polyurethane foam provides excellent insulation and a seamless moisture barrier, perfect for problem areas and penetrations.'


	},

	{ // What: Free Quotes Service Row. Why: A clear price lowers the bar to getting in touch. How: This describes it on its card.


		icoStr : '📋',
		titStr : 'Free Quotes',

		desStr : 'Transparent, detailed quotes at no cost or obligation. Know what the project involves and what it costs before any work begins.'


	}


];

// #endregion SER_RCD_ARR



const SER_ARE_ARR = [ 'Lawrence, KS', 'Topeka, KS', 'Kansas City Metro', 'All of Kansas', 'Continental U.S.' ]; // What: Service Area Array. Why: The service area panel tags every place the company works. How: Each entry is a tag's text and React key, from home outward.

// #endregion Constants



// #region Components

// #region SerSecCom

/**
 * SerSecCom = Services Section Component
 *
 * @summary
 * Renders the services section: the header, a card for each row of
 * SER_RCD_ARR, and the service area panel with a tag for each entry of
 * SER_ARE_ARR. Its header, every card, and the area panel are fade-up
 * blocks, revealed 80ms apart once the section scrolls into view.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The services section element.
 *
 * @example
 * ```tsx
 * SerSecCom() // => <SerSecCom />
 * ```
 *
*/

function SerSecCom () : React.JSX.Element {


	const secEleRef = useRevSecFun( 80 ); // What: Section Element Reference. Why: The section's blocks fade in as it scrolls into view. How: This is the ref the reveal hook watches, staggering the blocks 80ms apart.



	return (


		<section
			ref={ secEleRef }

			id='services'

			className='services'
		>{ /* What: Services Section Element. Why: The page's second section shows what the company does. How: Its id, kept as is because it's a link target, is where the Services link and the hero's button scroll to. */ }


			<div className='container'>{ /* What: Services Container Div Element. Why: The section's content lines up with the page's content width. How: This centers it within the container. */ }


				<div className='services__header fade-up'>{ /* What: Services Header Div Element. Why: The section opens by saying what it covers. How: This holds the label, heading, divider, and intro, and fades in first. */ }


					<p className='section-label'>What We Do</p>{ /* What: Services Label Paragraph Element. Why: A short label sits above each section's heading. How: This names the section in small capitals. */ }

					<h2 className='section-title'>Our Services</h2>{ /* What: Services Title Heading Element. Why: The section needs its own heading. How: This is the section's h2. */ }

					<div className='divider' />{ /* What: Services Divider Div Element. Why: A short rule separates the heading from the intro. How: This draws it. */ }

					<p className='services__intro'>{ /* What: Services Intro Paragraph Element. Why: The section opens with the company's promise. How: This sums up its range of work. */ }
						Seal and Shield is a full-service commercial roofing company.
						Whether you need a complete new roof, a targeted repair, or just peace of mind from a professional inspection,
						we have you covered.
					</p>


				</div>



				<div className='services__grid'>{ /* What: Services Grid Div Element. Why: The services read best as a grid of cards. How: This lays the cards out in columns. */ }


					{ SER_RCD_ARR.map( ( serRcdObj ) => ( // What: Service Card Map. Why: Each service gets its own card. How: This renders one card per row.


						<div
							key={ serRcdObj.titStr }

							className='services__card fade-up'
						>{ /* What: Services Card Div Element. Why: Each service reads as its own block. How: This stacks the icon, title, and description, and fades in in turn. */ }


							<span className='services__card-icon'>{ serRcdObj.icoStr }</span>{ /* What: Services Card Icon Span Element. Why: An icon helps a visitor scan the grid. How: This shows the service's emoji. */ }

							<h3 className='services__card-title'>{ serRcdObj.titStr }</h3>{ /* What: Services Card Title Heading Element. Why: Each card names its service. How: This is the card's h3. */ }

							<p className='services__card-desc'>{ serRcdObj.desStr }</p>{ /* What: Services Card Description Paragraph Element. Why: Visitors want to know what the service involves. How: This describes it. */ }


						</div>


					))}


				</div>



				<div className='services__area fade-up'>{ /* What: Services Area Div Element. Why: Visitors want to know whether the company works where they are. How: This panel describes the service area beside its tags, and fades in last. */ }


					<div className='services__area-text'>{ /* What: Services Area Text Div Element. Why: The panel explains its tags. How: This holds the label, heading, divider, and description. */ }


						<p className='section-label'>Where We Work</p>{ /* What: Area Label Paragraph Element. Why: A short label sits above the panel's heading. How: This names it in small capitals. */ }

						<h3 className='section-title'>Service Area</h3>{ /* What: Area Title Heading Element. Why: The panel needs its own heading. How: This is the panel's h3. */ }

						<div className='divider' />{ /* What: Area Divider Div Element. Why: A short rule separates the heading from the description. How: This draws it. */ }

						<p className='services__area-desc'>{ /* What: Area Description Paragraph Element. Why: The tags need a sentence of context. How: This names the home base, the region, and the willingness to travel. */ }
							Based in Lawrence, Kansas, Seal and Shield serves businesses across all of Kansas,
							including Topeka, Lawrence, and the greater Kansas City metro area.
							We're also willing to travel anywhere in the continental United States for the right project.
						</p>


					</div>

					<div className='services__area-tags'>{ /* What: Area Tags Div Element. Why: Each place the company works gets a quick tag. How: This wraps the tags in rows. */ }


						{ SER_ARE_ARR.map( ( areNamStr ) => ( // What: Area Tag Map. Why: Each area gets a tag. How: This renders one span per entry.


							<span
								key={ areNamStr }

								className='services__area-tag'
							>{ /* What: Services Area Tag Span Element. Why: Each tag names one place. How: This shows the area's name. */ }
								{ areNamStr }
							</span>


						))}


					</div>


				</div>


			</div>


		</section>


	);


}

// #endregion SerSecCom

// #endregion Components



// #region Exports

export { SerSecCom }; // What: Named Exports. Why: The home page renders the services second. How: This exports SerSecCom.

// #endregion Exports


