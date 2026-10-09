


// #region Imports

import lofPngUrl from './logo-full.png'; // What: Logo-Full PNG URL. Why: The about section's left column shows the full logo. How: Vite resolves this to the image's fingerprinted URL, which the logo's img element loads.


import { useRevSecFun } from './reveal.ts'; // What: Use Reveal Section Function. Why: The section's blocks fade in as they scroll into view. How: This returns the ref the section attaches, staggered 100ms per block.


import './about.css'; // What: About Stylesheet Import. Why: The section's two-column layout, info card, and values are styled in their own stylesheet. How: This is imported purely for its side effect.

// #endregion Imports



/**
 * about.tsx = About
 *
 * @summary
 * The page's third section. Its left column shows the full logo over an
 * info card listing when and where the company was founded, its phone
 * number, and its hours; its right column tells the company's story and
 * lists its three values. Each block fades in as the section scrolls into
 * view. Its id, about, is what the bar's About link scrolls to.
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

// #region ABO_VAL_ARR

/**
 * ABO_VAL_ARR = About Value Array
 *
 * @summary
 * The company's three values, in display order. Every row shares one shape,
 * so its fields carry no comments of their own:
 * - `desStr` (String): Description String, the value's sentence.
 * - `titStr` (String): Title String, the value's heading, which also serves
 *   as the row's React key.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const ABO_VAL_ARR = [ // What: About Value Array. Why: The story closes with what the company stands for. How: Each row holds a value's title and sentence.


	{ // What: Integrity Value Row. Why: Honesty is the first thing a client needs from a roofer. How: This promises no hidden costs or shortcuts.


		titStr : 'Integrity',

		desStr : 'We show up, tell the truth, and do the work right. No hidden costs, no shortcuts.'


	},

	{ // What: Quality Value Row. Why: Materials and workmanship decide how long a roof lasts. How: This names the Conklin-certified products.


		titStr : 'Quality',

		desStr : 'We use premium materials (Conklin-certified products) and back our work with professional craftsmanship.'


	},

	{ // What: Reliability Value Row. Why: Clients want one company with them from start to finish. How: This promises it from inspection to walk-through.


		titStr : 'Reliability',

		desStr : 'From the first inspection to the final walk-through, Seal and Shield is there every step of the way.'


	}


];

// #endregion ABO_VAL_ARR

// #endregion Constants



// #region Components

// #region AboSecCom

/**
 * AboSecCom = About Section Component
 *
 * @summary
 * Renders the about section: the logo and info card on the left, the story
 * and values on the right. The left column, each piece of the story, and
 * each value are fade-up blocks, revealed 100ms apart once the section
 * scrolls into view; the values also delay their own fade by 80ms each, so
 * they settle one after another. The logo's light backdrop is decorative
 * and hidden from assistive technology.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The about section element.
 *
 * @example
 * ```tsx
 * AboSecCom() // => <AboSecCom />
 * ```
 *
*/

function AboSecCom () : React.JSX.Element {


	const secEleRef = useRevSecFun( 100 ); // What: Section Element Reference. Why: The section's blocks fade in as it scrolls into view. How: This is the ref the reveal hook watches, staggering the blocks 100ms apart.



	return (


		<section
			ref={ secEleRef }

			id='about'

			className='about'
		>{ /* What: About Section Element. Why: The page's third section introduces the company. How: Its id, kept as is because it's a link target, is where the About link scrolls to. */ }


			<div className='container'>{ /* What: About Container Div Element. Why: The section's content lines up with the page's content width. How: This centers it within the container. */ }


				<div className='about__layout'>{ /* What: About Layout Div Element. Why: The logo and details sit beside the story. How: This lays them out in two columns. */ }


					<div className='about__visual fade-up'>{ /* What: About Visual Div Element. Why: The left column pairs the logo with the company's key facts. How: This stacks the logo over the info card, and fades in as one block. */ }


						<div
							className='about__logo-bg'

							aria-hidden='true'
						/>{ /* What: About Logo Background Div Element. Why: A light panel sets the logo off from the page. How: This is decorative and hidden from assistive technology. */ }

						<img
							className='about__logo'

							src={ lofPngUrl }

							alt='Seal and Shield LLC'
						/>{ /* What: About Logo Image Element. Why: The full logo anchors the left column. How: Its alt text repeats the name the image shows. */ }


						<div className='about__info-card'>{ /* What: About Info Card Div Element. Why: Visitors want the company's key facts at a glance. How: This lists them as label and value rows. */ }


							<div className='about__info-row'>{ /* What: Founded Info Row Div Element. Why: The founding year shows how long the company has been at it. How: This pairs the label with 2024. */ }


								<span className='about__info-label'>Founded</span>{ /* What: Founded Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<span className='about__info-value'>2024</span>{ /* What: Founded Value Span Element. Why: This is the fact itself. How: This shows the year. */ }


							</div>

							<div className='about__info-row'>{ /* What: Based In Info Row Div Element. Why: A local business should say where it's based. How: This pairs the label with Lawrence. */ }


								<span className='about__info-label'>Based In</span>{ /* What: Based In Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<span className='about__info-value'>Lawrence, KS</span>{ /* What: Based In Value Span Element. Why: This is the fact itself. How: This shows the town. */ }


							</div>

							<div className='about__info-row'>{ /* What: Phone Info Row Div Element. Why: The phone number belongs with the company's details. How: This pairs the label with a dialing link. */ }


								<span className='about__info-label'>Phone</span>{ /* What: Phone Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<a
									className='about__info-value about__info-link'

									href='tel:7853041957'
								>{ /* What: Phone Value Anchor Element. Why: Visitors reading the details can call straight away. How: This dials the number on phones. */ }
									(785) 304-1957
								</a>


							</div>

							<div className='about__info-row'>{ /* What: Hours Info Row Div Element. Why: Callers should know when someone will answer. How: This pairs the label with the business hours. */ }


								<span className='about__info-label'>Hours</span>{ /* What: Hours Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<span className='about__info-value'>8 a.m. – 5 p.m.</span>{ /* What: Hours Value Span Element. Why: This is the fact itself. How: This shows the hours. */ }


							</div>


						</div>


					</div>



					<div className='about__text'>{ /* What: About Text Div Element. Why: The right column tells the company's story. How: This stacks the label, heading, story, and values. */ }


						<p className='section-label fade-up'>Who We Are</p>{ /* What: About Label Paragraph Element. Why: A short label sits above each section's heading. How: This names the section in small capitals, and fades in first. */ }

						<h2 className='section-title fade-up'>About Seal and Shield</h2>{ /* What: About Title Heading Element. Why: The section needs its own heading. How: This is the section's h2. */ }

						<div className='divider fade-up' />{ /* What: About Divider Div Element. Why: A short rule separates the heading from the story. How: This draws it. */ }

						<p className='about__body fade-up'>{ /* What: About Founding Paragraph Element. Why: The story opens with when the company started and why. How: This gives its founding year, mission, and home town. */ }
							Seal and Shield LLC was founded in 2024 with a simple mission: provide Kansas businesses
							with trustworthy, high-quality commercial roofing they can count on for years to come.
							Based in Lawrence, Kansas, we combine hands-on expertise with premium materials to
							deliver results that protect your investment.
						</p>

						<p className='about__body fade-up'>{ /* What: About Conklin Paragraph Element. Why: The Conklin partnership sets the company apart. How: This explains what it gives clients. */ }
							As an authorized Conklin distributor, we have direct access to some of the most
							advanced commercial roofing coatings available, and we back every job with the
							kind of craftsmanship and communication that earns long-term relationships.
						</p>



						<div className='about__values'>{ /* What: About Values Div Element. Why: The story closes with what the company stands for. How: This lists the three values. */ }


							{ ABO_VAL_ARR.map( ( valRcdObj, valIndNum ) => ( // What: Value Map. Why: Each value gets its own row. How: This renders one row per value, passing its position for the fade delay.


								<div
									key={ valRcdObj.titStr }

									className='about__value fade-up'

									style={{ transitionDelay : `${ valIndNum * 80 }ms` }}
								>{ /* What: About Value Div Element. Why: Each value reads as its own row. How: This pairs a marker with the value's text, delaying its fade 80ms per row. */ }


									<div
										className='about__value-marker'

										aria-hidden='true'
									/>{ /* What: About Value Marker Div Element. Why: A short bar marks each value. How: This is decorative and hidden from assistive technology. */ }

									<div>{ /* What: About Value Text Div Element. Why: The title and sentence stack beside the marker. How: This holds the two. */ }


										<h3 className='about__value-title'>{ valRcdObj.titStr }</h3>{ /* What: About Value Title Heading Element. Why: Each value is named. How: This is the value's h3. */ }

										<p className='about__value-desc'>{ valRcdObj.desStr }</p>{ /* What: About Value Description Paragraph Element. Why: Each value is explained in a sentence. How: This shows it beneath the title. */ }


									</div>


								</div>


							))}


						</div>


					</div>


				</div>


			</div>


		</section>


	);


}

// #endregion AboSecCom

// #endregion Components



// #region Exports

export { AboSecCom }; // What: Named Exports. Why: The home page renders the about section third. How: This exports AboSecCom.

// #endregion Exports


