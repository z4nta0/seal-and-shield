


// #region Imports

import cssModObj from './contact.module.css'; // What: CSS Module Object. Why: The section is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.


import { useRevSecFun } from './reveal.ts'; // What: Use Reveal Section Function. Why: The section's blocks fade in as they scroll into view. How: This returns the ref the section attaches, staggered 80ms per block.
import { useState     } from 'react';       // What: Use State. Why: The section tracks the form's fields and whether it was just sent. How: This holds both.

// #endregion Imports



/**
 * contact.tsx = Contact
 *
 * @summary
 * The page's last section, where visitors reach the company: an invitation
 * with the company's location, phone number, and hours and a call button on
 * the left, and the free quote request form on the right. The form posts to
 * Netlify Forms as contactForm, which finds the form through the hidden copy
 * in index.html, so every field's name has to match that copy. Once sent,
 * the form gives way to a thank-you message for six seconds. Each block fades
 * in as the section scrolls into view. Its id, contact, is what the bar's
 * Contact link and the hero's quote button scroll to.
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

const EMP_FOR_OBJ = { company : '', email : '', message : '', name : '', phone : '' }; // What: Empty Form Object. Why: The form starts empty and empties again once sent. How: Each key is a field's name attribute, which Netlify records, so the keys can't be renamed.

// #endregion Constants



// #region Components

// #region ConSecCom

/**
 * ConSecCom = Contact Section Component
 *
 * @summary
 * Renders the contact section. The form's fields are controlled by
 * forDatObj, whose keys match each field's name attribute, so one change
 * handler serves all five. The browser checks the required fields before
 * submitting, then forSubFun posts the fields to Netlify Forms and shows the
 * thank-you message only once Netlify confirms it, or an error message that
 * keeps the fields filled in if it doesn't. The background accent is
 * decorative and hidden from assistive technology.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The contact section element.
 *
 * @example
 * ```tsx
 * ConSecCom() // => <ConSecCom />
 * ```
 *
*/

function ConSecCom () : React.JSX.Element {


	const secEleRef = useRevSecFun( 80 ); // What: Section Element Reference. Why: The section's blocks fade in as it scrolls into view. How: This is the ref the reveal hook watches, staggering the blocks 80ms apart.

	const [ forSenBoo, setForSenBoo ] = useState( false );       // What: Form Sent Boolean And Setter. Why: The form gives way to a thank-you message once sent. How: This holds whether the message is showing.
	const [ forDatObj, setForDatObj ] = useState( EMP_FOR_OBJ ); // What: Form Data Object And Setter. Why: The fields are controlled, so the form can empty itself once sent. How: This holds every field's current value, keyed by its name.
	const [ forErrBoo, setForErrBoo ] = useState( false );       // What: Form Error Boolean And Setter. Why: A visitor whose request didn't go through has to be told, with their details kept for a retry. How: This holds whether the error message is showing.
	const [ senProBoo, setSenProBoo ] = useState( false );       // What: Send Progress Boolean And Setter. Why: The button shouldn't send the same request twice while the first is still on its way. How: This holds whether a submission is waiting on Netlify's answer.


	// #region fieChaFun

	/**
	 * fieChaFun = Field Change Function
	 *
	 * @summary
	 * The change handler every field shares. It copies the field's new value
	 * into forDatObj under the field's name attribute, which works only
	 * because each field's name matches its key in forDatObj.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param chaEveObj - Change Event Object: The field's change event.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * fieChaFun(chaEveObj) // => void
	 * ```
	 *
	*/

	const fieChaFun = ( chaEveObj : React.ChangeEvent< HTMLInputElement | HTMLTextAreaElement > ) => setForDatObj( ( preDatObj ) => ({ ...preDatObj, [ chaEveObj.target.name ] : chaEveObj.target.value }) ); // What: Field Change Function. Why: Every field updates the same form state. How: This copies the previous values and sets the changed field's value under its name.

	// #endregion fieChaFun


	// #region forSubFun

	/**
	 * forSubFun = Form Submit Function
	 *
	 * @summary
	 * Handles the form's submit once the browser's own validation has passed
	 * (Full Name and Phone are required, and Email has to look like an
	 * address): stops the page-reloading submit, hides any earlier error, and
	 * posts the form's fields to Netlify Forms as URL-encoded data, whose
	 * form-name field tells Netlify which form they belong to. While the
	 * request is out, the submit button is disabled and its label says
	 * Sending... instead. Only an OK answer from Netlify counts as sent: then
	 * the thank-you message shows, the fields empty, and the form comes back
	 * six seconds later. A request that fails outright, or one Netlify
	 * rejects, keeps the visitor's details in place and shows the error
	 * message instead, so they can try again or call; a request that fails
	 * outright is also logged to the console.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param subEveObj - Submit Event Object: The form's submit event.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * forSubFun(subEveObj) // => Promise<void>
	 * ```
	 *
	*/

	const forSubFun = async ( subEveObj : React.SubmitEvent< HTMLFormElement > ) => { // What: Form Submit Function. Why: The form sends its fields without leaving the page, and only reports success once Netlify confirms it. How: This posts them to Netlify Forms, then shows the thank-you message or the error message depending on the answer.


		subEveObj.preventDefault(); // What: Default Submit Cancel. Why: A normal submit would reload the page. How: This stops it, so the fetch below sends the fields instead.


		const forCurEle = subEveObj.target as HTMLFormElement;                              // What: Form Current Element. Why: The fields are read from the form itself. How: This is the element the submit event fired on. // What: Type Assertion Note. Why: An event's target types as a plain EventTarget. How: A submit event always fires on its form element.
		const forValObj = new FormData( forCurEle ) as unknown as Record< string, string >; // What: Form Value Object. Why: Netlify expects the form's fields as name and value pairs. How: This reads every named field, form-name included. // What: Type Assertion Note. Why: URLSearchParams doesn't accept a FormData in TypeScript's types. How: Every field in this form holds text, so its entries read as plain string pairs.

		let senOkaBoo = false; // What: Send Okay Boolean. Why: Only a confirmed submission should show the thank-you message. How: This starts false and turns true only when Netlify answers OK.


		setForErrBoo( false ); // What: Error Message Hide Call. Why: A new attempt shouldn't keep showing the last one's error. How: This hides the error message.

		setSenProBoo( true ); // What: Sending Start Call. Why: The visitor should see the request is on its way, and shouldn't send it twice. How: This disables the button and switches its label to say Sending... instead.



		try {


			const netResObj = await fetch( '/', { // What: Netlify Response Object. Why: Netlify Forms records a post to the site's own address carrying the form's name, and its answer says whether it did. How: This posts the fields URL-encoded and waits for the answer.


				body    : new URLSearchParams( forValObj ).toString(),             // What: Body. Why: Netlify reads the fields as a URL-encoded string. How: This encodes every name and value pair.
				headers : { 'Content-Type' : 'application/x-www-form-urlencoded' }, // What: Headers. Why: The body's format has to be declared. How: This marks it as URL-encoded form data.
				method  : 'POST'                                                    // What: Method. Why: A form submission is a post. How: This sends it as one.


			} );


			senOkaBoo = netResObj.ok; // What: Send Okay Update. Why: Netlify can answer with an error, which still counts as a failed submission. How: This records whether the answer's status was in the 200s.


		}

		catch ( errCatObj ) { console.warn( errCatObj ); } // What: Network Failure Catch. Why: A request that can't be made at all, such as when the visitor is offline, should still be visible to anyone debugging. How: This logs the error and leaves senOkaBoo false.



		setSenProBoo( false ); // What: Sending End Call. Why: The request has its answer, so the button can be used again. How: This re-enables the button and restores its label.



		if ( senOkaBoo ) { // What: Sent Check. Why: Only a confirmed submission is reported as sent. How: This shows the thank-you message, empties the fields, and schedules the form's return.


			setForSenBoo( true ); // What: Sent Message Show Call. Why: The visitor should see that the form went. How: This swaps the form for the thank-you message.

			setForDatObj( EMP_FOR_OBJ ); // What: Form Reset Call. Why: The form should come back empty. How: This restores every field to blank.

			window.setTimeout( () => setForSenBoo( false ), 6000 ); // What: Form Return Timer. Why: A visitor may want to send another request. How: This brings the form back after six seconds.


		}

		else setForErrBoo( true ); // What: Error Message Show Call. Why: A failed submission must not look sent. How: This shows the error message and keeps every field as the visitor filled it in.


	};

	// #endregion forSubFun



	return (


		<section
			ref={ secEleRef }

			id='contact'

			className={ cssModObj.homConSec }
		>{ /* What: Home Contact Section Element. Why: The page ends where visitors reach the company. How: Its id, kept as is because it's a link target, is where the Contact link and the hero's quote button scroll to. */ }


			<div
				className={ cssModObj.conBacDiv }

				aria-hidden='true'
			/>{ /* What: Contact Background Div Element. Why: A soft accent sets the section off from the one above. How: This is decorative and hidden from assistive technology. */ }



			<div className={ cssModObj.conInnDiv }>{ /* What: Contact Inner Div Element. Why: The invitation and the form sit side by side. How: This lays them out in two columns within the content width. */ }


				<div>{ /* What: Contact Info Div Element. Why: The left column invites the visitor and lists every way to get in touch. How: This stacks the label, heading, invitation, details, and call button. */ }


					<p
						className={ cssModObj.eyeLabPar }

						data-scroll-reveal-block
					>{ /* What: Contact Label Paragraph Element. Why: A short label sits above each section's heading. How: This names the section in small capitals, and fades in first. */ }
						Get In Touch
					</p>

					<h2
						className={` ${ cssModObj.secTitHea }   ${ cssModObj.secTitHeaLight } `}

						data-scroll-reveal-block
					>{ /* What: Contact Title Heading Element. Why: The section's heading states the goal. How: This is the section's h2, broken across two lines. */ }
						Request a Free<br />Quote Today
					</h2>

					<div
						className={ cssModObj.secDivDiv }

						data-scroll-reveal-block
					/>{ /* What: Contact Divider Div Element. Why: A short rule separates the heading from the invitation. How: This draws it. */ }

					<p
						className={ cssModObj.infBodPar }

						data-scroll-reveal-block
					>{ /* What: Info Body Paragraph Element. Why: The section invites the visitor to get in touch. How: This offers the free inspection and names the area served. */ }
						Ready to protect your commercial roof? Reach out to Seal and Shield for
						a free inspection or quote. We serve Lawrence, Topeka, the Kansas City metro,
						and beyond.
					</p>



					<div
						className={ cssModObj.conDetDiv }

						data-scroll-reveal-block
					>{ /* What: Contact Details Div Element. Why: Visitors want the location, number, and hours together. How: This lists them as icon and text rows. */ }


						<div className={ cssModObj.detRowDiv }>{ /* What: Location Detail Div Element. Why: A local business should say where it is. How: This pairs a pin icon with the town. */ }


							<span
								className={ cssModObj.detIcoSpa }

								aria-hidden='true'
							>{ /* What: Location Icon Span Element. Why: An icon helps a visitor scan the rows. How: This shows a pin, hidden from screen readers since the label beside it already says what the row is. */ }📍</span>

							<div>{ /* What: Location Text Div Element. Why: The label and value stack beside the icon. How: This holds the two. */ }


								<span className={ cssModObj.detLabSpa }>Location</span>{ /* What: Location Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<span className={ cssModObj.detValSpa }>Lawrence, Kansas</span>{ /* What: Location Value Span Element. Why: This is the detail itself. How: This shows the town. */ }


							</div>


						</div>


						<div className={ cssModObj.detRowDiv }>{ /* What: Phone Detail Div Element. Why: The phone number is the quickest way in. How: This pairs a phone icon with a dialing link. */ }


							<span
								className={ cssModObj.detIcoSpa }

								aria-hidden='true'
							>{ /* What: Phone Icon Span Element. Why: An icon helps a visitor scan the rows. How: This shows a phone, hidden from screen readers since the label beside it already says what the row is. */ }📞</span>

							<div>{ /* What: Phone Text Div Element. Why: The label and value stack beside the icon. How: This holds the two. */ }


								<span className={ cssModObj.detLabSpa }>Phone</span>{ /* What: Phone Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<a
									className={ cssModObj.detValAnc }

									href='tel:7853041957'
								>{ /* What: Phone Value Anchor Element. Why: Visitors can call straight from the details. How: This dials the number on phones. */ }
									(785) 304-1957
								</a>


							</div>


						</div>


						<div className={ cssModObj.detRowDiv }>{ /* What: Hours Detail Div Element. Why: Callers should know when someone will answer. How: This pairs a clock icon with the hours. */ }


							<span
								className={ cssModObj.detIcoSpa }

								aria-hidden='true'
							>{ /* What: Hours Icon Span Element. Why: An icon helps a visitor scan the rows. How: This shows a clock, hidden from screen readers since the label beside it already says what the row is. */ }🕐</span>

							<div>{ /* What: Hours Text Div Element. Why: The label and value stack beside the icon. How: This holds the two. */ }


								<span className={ cssModObj.detLabSpa }>Business Hours</span>{ /* What: Hours Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<span className={ cssModObj.detValSpa }>Monday – Friday, 8 a.m. – 5 p.m.</span>{ /* What: Hours Value Span Element. Why: This is the detail itself. How: This shows the weekday hours. */ }


							</div>


						</div>


					</div>



					<a
						className={ cssModObj.conPhoAnc }

						data-scroll-reveal-block

						href='tel:7853041957'
					>{ /* What: Contact Phone Anchor Element. Why: Calling is the fastest way to get a quote. How: This dials the number on phones, styled as a button. */ }
						Call Now: (785) 304-1957
					</a>


				</div>



				<div
					className={ cssModObj.forWraDiv }

					data-scroll-reveal-block
				>{ /* What: Form Wrap Div Element. Why: The form and its thank-you message share one panel. How: This holds whichever is showing, and fades in as one block. */ }


					{ forSenBoo ? ( // What: Sent Message Branch. Why: A just-sent form gives way to a thank-you. How: This shows the message while forSenBoo is true.


						<div className={ cssModObj.forSucDiv }>{ /* What: Form Success Div Element. Why: The visitor should know the form went through. How: This stacks a check, a heading, and a note. */ }


							<span className={ cssModObj.sucIcoSpa }>✓</span>{ /* What: Success Icon Span Element. Why: A check mark signals success at a glance. How: This shows it large. */ }

							<h3 className={ cssModObj.sucTitHea }>Message Sent!</h3>{ /* What: Success Title Heading Element. Why: The message needs a clear heading. How: This is the panel's h3. */ }

							<p className={ cssModObj.sucBodPar }>{ /* What: Success Body Paragraph Element. Why: The visitor should know what happens next. How: This says the company will be in touch. */ }
								Thank you for reaching out. Seal and Shield will be in touch shortly.
							</p>


						</div>


					) : ( // What: Quote Form Branch. Why: The form shows whenever it hasn't just been sent. How: This renders the quote request form.


						<form
							data-netlify='true'
							name='contactForm'

							onSubmit={ forSubFun }
						>{ /* What: Contact Form Element. Why: Visitors request a free quote here. How: Its name, contactForm, matches the hidden copy Netlify reads, the browser checks the required fields before submitting, and forSubFun sends it. */ }


							<h3 className={ cssModObj.forTitHea }>Free Quote Request</h3>{ /* What: Form Title Heading Element. Why: The form needs a clear heading. How: This is the panel's h3. */ }



							<div className={ cssModObj.forRowDiv }>{ /* What: Name Company Row Div Element. Why: Short fields pair up on wide screens. How: This holds the name and company fields side by side. */ }


								<div className={ cssModObj.forFieDiv }>{ /* What: Name Field Div Element. Why: Each field stacks its label over its input. How: This holds the name field. */ }


									<label
										className={ cssModObj.forFieLab }

										htmlFor='conNamInp'
									>{ /* What: Name Label Element. Why: Every field needs a visible label. How: This names the field and marks it required. */ }
										Full Name *
									</label>

									<input
										id='conNamInp'

										className={ cssModObj.forFieInp }

										name='name'

										placeholder='John Smith'
										required
										type='text'
										value={ forDatObj.name }

										onChange={ fieChaFun }
									/>{ /* What: Contact Name Input Element. Why: The company needs to know who's asking. How: Its name, name, is the key Netlify records and forDatObj holds. */ }


								</div>

								<div className={ cssModObj.forFieDiv }>{ /* What: Company Field Div Element. Why: Each field stacks its label over its input. How: This holds the company field. */ }


									<label
										className={ cssModObj.forFieLab }

										htmlFor='conComInp'
									>{ /* What: Company Label Element. Why: Every field needs a visible label. How: This names the field. */ }
										Company
									</label>

									<input
										id='conComInp'

										className={ cssModObj.forFieInp }

										name='company'

										placeholder='ABC Business LLC'
										type='text'
										value={ forDatObj.company }

										onChange={ fieChaFun }
									/>{ /* What: Contact Company Input Element. Why: Commercial work is for a business. How: Its name, company, is the key Netlify records and forDatObj holds. */ }


								</div>


							</div>



							<div className={ cssModObj.forRowDiv }>{ /* What: Phone Email Row Div Element. Why: Short fields pair up on wide screens. How: This holds the phone and email fields side by side. */ }


								<div className={ cssModObj.forFieDiv }>{ /* What: Phone Field Div Element. Why: Each field stacks its label over its input. How: This holds the phone field. */ }


									<label
										className={ cssModObj.forFieLab }

										htmlFor='conPhoInp'
									>{ /* What: Phone Label Element. Why: Every field needs a visible label. How: This names the field and marks it required. */ }
										Phone *
									</label>

									<input
										id='conPhoInp'

										className={ cssModObj.forFieInp }

										name='phone'

										placeholder='(555) 000-0000'
										required
										type='tel'
										value={ forDatObj.phone }

										onChange={ fieChaFun }
									/>{ /* What: Contact Phone Input Element. Why: The company calls back to schedule an inspection. How: Its name, phone, is the key Netlify records and forDatObj holds. */ }


								</div>

								<div className={ cssModObj.forFieDiv }>{ /* What: Email Field Div Element. Why: Each field stacks its label over its input. How: This holds the email field. */ }


									<label
										className={ cssModObj.forFieLab }

										htmlFor='conEmaInp'
									>{ /* What: Email Label Element. Why: Every field needs a visible label. How: This names the field. */ }
										Email
									</label>

									<input
										id='conEmaInp'

										className={ cssModObj.forFieInp }

										name='email'

										placeholder='john@example.com'
										type='email'
										value={ forDatObj.email }

										onChange={ fieChaFun }
									/>{ /* What: Contact Email Input Element. Why: Some visitors would rather hear back by email. How: Its name, email, is the key Netlify records and forDatObj holds. */ }


								</div>


							</div>



							<div className={` ${ cssModObj.forFieDiv }   ${ cssModObj.forFieDivFull } `}>{ /* What: Message Field Div Element. Why: The message needs the form's full width. How: This holds the message field across both columns. */ }


								<label
									className={ cssModObj.forFieLab }

									htmlFor='conMesTex'
								>{ /* What: Message Label Element. Why: Every field needs a visible label. How: This invites the visitor to describe the job. */ }
									Tell us about your roof
								</label>

								<textarea
									id='conMesTex'

									className={ cssModObj.forFieTex }

									name='message'

									placeholder='Describe your commercial roof, square footage, current issues, or any questions...'
									rows={ 4 }
									value={ forDatObj.message }

									onChange={ fieChaFun }
								/>{ /* What: Contact Message Textarea Element. Why: Details about the roof make for a better quote. How: Its name, message, is the key Netlify records and forDatObj holds. */ }


							</div>

							<input
								name='form-name'

								type='hidden'
								value='contactForm'
							/>{ /* What: Form Name Input Element. Why: Netlify matches a posted submission to its form by this field. How: This posts contactForm along with the visitor's fields. */ }

							{ forErrBoo && ( // What: Error Message Check. Why: A failed submission has to be explained. How: This shows the error message while forErrBoo is true.


								<p
									className={ cssModObj.forErrPar }

									role='alert'
								>{ /* What: Form Error Paragraph Element. Why: The visitor needs to know the request didn't go through and what to do next. How: Its alert role has screen readers announce it the moment it appears. */ }
									Sorry, your request didn't go through. Please try again, or call us at <a className={ cssModObj.errLinAnc } href='tel:7853041957'>(785) 304-1957</a>.
								</p>


							) }

							<button
								className={ cssModObj.forSubBut }

								disabled={ senProBoo }
								type='submit'
							>{ /* What: Form Submit Button Element. Why: The visitor sends the request here. How: This submits the form through forSubFun, and is disabled while a submission is on its way. */ }
								{ senProBoo ? 'Sending...' : 'Submit Free Quote Request' }{ /* What: Submit Label Expression. Why: The button should say when it's busy. How: This reads Sending... while a submission is out. */ }
							</button>

							<p className={ cssModObj.forNotPar }>{ /* What: Form Note Paragraph Element. Why: Visitors worry about what happens to their details. How: This promises no spam. */ }
								No spam. We'll only contact you regarding your roofing inquiry.
							</p>


						</form>


					) }


				</div>


			</div>


		</section>


	);


}

// #endregion ConSecCom

// #endregion Components



// #region Exports

export { ConSecCom }; // What: Named Exports. Why: The home page renders the contact section last. How: This exports ConSecCom.

// #endregion Exports


