


// #region Imports

import { useRevSecFun } from './reveal.ts'; // What: Use Reveal Section Function. Why: The section's blocks fade in as they scroll into view. How: This returns the ref the section attaches, staggered 80ms per block.
import { useState     } from 'react';       // What: Use State. Why: The section tracks the form's fields and whether it was just sent. How: This holds both.


import './contact.css'; // What: Contact Stylesheet Import. Why: The section's background, details, and quote form are styled in their own stylesheet. How: This is imported purely for its side effect.

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
 * handler serves all five. Submitting posts the form's fields to Netlify
 * Forms, then shows the thank-you message right away and brings the empty
 * form back six seconds later. The background accent is decorative and
 * hidden from assistive technology.
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
	 * Handles the form's submit: stops the browser's own page-reloading
	 * submit, posts the form's fields to Netlify Forms as URL-encoded data,
	 * whose form-name field tells Netlify which form they belong to, and
	 * alerts the error if the request can't be made at all. Without waiting
	 * for the response, it shows the thank-you message, empties the fields,
	 * and brings the form back six seconds later.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param subEveObj - Submit Event Object: The form's submit event.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * forSubFun(subEveObj) // => void
	 * ```
	 *
	*/

	const forSubFun = ( subEveObj : React.SubmitEvent< HTMLFormElement > ) => { // What: Form Submit Function. Why: The form sends its fields without leaving the page. How: This posts them to Netlify Forms and shows the thank-you message.


		subEveObj.preventDefault(); // What: Default Submit Cancel. Why: A normal submit would reload the page. How: This stops it, so the fetch below sends the fields instead.


		const forCurEle = subEveObj.target as HTMLFormElement;                              // What: Form Current Element. Why: The fields are read from the form itself. How: This is the element the submit event fired on. // What: Type Assertion Note. Why: An event's target types as a plain EventTarget. How: A submit event always fires on its form element.
		const forValObj = new FormData( forCurEle ) as unknown as Record< string, string >; // What: Form Value Object. Why: Netlify expects the form's fields as name and value pairs. How: This reads every named field, form-name included. // What: Type Assertion Note. Why: URLSearchParams doesn't accept a FormData in TypeScript's types. How: Every field in this form holds text, so its entries read as plain string pairs.


		fetch( '/', { // What: Netlify Submission Call. Why: Netlify Forms records a post to the site's own address carrying the form's name. How: This posts the fields URL-encoded, and alerts the error if the request fails outright.


			body    : new URLSearchParams( forValObj ).toString(),             // What: Body. Why: Netlify reads the fields as a URL-encoded string. How: This encodes every name and value pair.
			headers : { 'Content-Type' : 'application/x-www-form-urlencoded' }, // What: Headers. Why: The body's format has to be declared. How: This marks it as URL-encoded form data.
			method  : 'POST'                                                    // What: Method. Why: A form submission is a post. How: This sends it as one.


		} ).catch( ( errCatObj ) => alert( errCatObj ) );


		setForSenBoo( true ); // What: Sent Message Show Call. Why: The visitor should see that the form went. How: This swaps the form for the thank-you message.

		setForDatObj( EMP_FOR_OBJ ); // What: Form Reset Call. Why: The form should come back empty. How: This restores every field to blank.

		window.setTimeout( () => setForSenBoo( false ), 6000 ); // What: Form Return Timer. Why: A visitor may want to send another request. How: This brings the form back after six seconds.


	};

	// #endregion forSubFun



	return (


		<section
			ref={ secEleRef }

			id='contact'

			className='contact'
		>{ /* What: Contact Section Element. Why: The page ends where visitors reach the company. How: Its id, kept as is because it's a link target, is where the Contact link and the hero's quote button scroll to. */ }


			<div
				className='contact__bg'

				aria-hidden='true'
			/>{ /* What: Contact Background Div Element. Why: A soft accent sets the section off from the one above. How: This is decorative and hidden from assistive technology. */ }



			<div className='container contact__inner'>{ /* What: Contact Inner Div Element. Why: The invitation and the form sit side by side. How: This lays them out in two columns within the content width. */ }


				<div className='contact__info'>{ /* What: Contact Info Div Element. Why: The left column invites the visitor and lists every way to get in touch. How: This stacks the label, heading, invitation, details, and call button. */ }


					<p className='section-label fade-up'>Get In Touch</p>{ /* What: Contact Label Paragraph Element. Why: A short label sits above each section's heading. How: This names the section in small capitals, and fades in first. */ }

					<h2 className='section-title light fade-up'>Request a Free<br />Quote Today</h2>{ /* What: Contact Title Heading Element. Why: The section's heading states the goal. How: This is the section's h2, broken across two lines. */ }

					<div className='divider fade-up' />{ /* What: Contact Divider Div Element. Why: A short rule separates the heading from the invitation. How: This draws it. */ }

					<p className='contact__info-body fade-up'>{ /* What: Contact Invitation Paragraph Element. Why: The section invites the visitor to get in touch. How: This offers the free inspection and names the area served. */ }
						Ready to protect your commercial roof? Reach out to Seal and Shield for
						a free inspection or quote. We serve Lawrence, Topeka, the Kansas City metro,
						and beyond.
					</p>



					<div className='contact__details fade-up'>{ /* What: Contact Details Div Element. Why: Visitors want the location, number, and hours together. How: This lists them as icon and text rows. */ }


						<div className='contact__detail'>{ /* What: Location Detail Div Element. Why: A local business should say where it is. How: This pairs a pin icon with the town. */ }


							<span className='contact__detail-icon'>📍</span>{ /* What: Location Icon Span Element. Why: An icon helps a visitor scan the rows. How: This shows a pin. */ }

							<div>{ /* What: Location Text Div Element. Why: The label and value stack beside the icon. How: This holds the two. */ }


								<span className='contact__detail-label'>Location</span>{ /* What: Location Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<span className='contact__detail-value'>Lawrence, Kansas</span>{ /* What: Location Value Span Element. Why: This is the detail itself. How: This shows the town. */ }


							</div>


						</div>


						<div className='contact__detail'>{ /* What: Phone Detail Div Element. Why: The phone number is the quickest way in. How: This pairs a phone icon with a dialing link. */ }


							<span className='contact__detail-icon'>📞</span>{ /* What: Phone Icon Span Element. Why: An icon helps a visitor scan the rows. How: This shows a phone. */ }

							<div>{ /* What: Phone Text Div Element. Why: The label and value stack beside the icon. How: This holds the two. */ }


								<span className='contact__detail-label'>Phone</span>{ /* What: Phone Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<a
									className='contact__detail-value contact__detail-link'

									href='tel:7853041957'
								>{ /* What: Phone Value Anchor Element. Why: Visitors can call straight from the details. How: This dials the number on phones. */ }
									(785) 304-1957
								</a>


							</div>


						</div>


						<div className='contact__detail'>{ /* What: Hours Detail Div Element. Why: Callers should know when someone will answer. How: This pairs a clock icon with the hours. */ }


							<span className='contact__detail-icon'>🕐</span>{ /* What: Hours Icon Span Element. Why: An icon helps a visitor scan the rows. How: This shows a clock. */ }

							<div>{ /* What: Hours Text Div Element. Why: The label and value stack beside the icon. How: This holds the two. */ }


								<span className='contact__detail-label'>Business Hours</span>{ /* What: Hours Label Span Element. Why: Each value needs its label. How: This names the row. */ }

								<span className='contact__detail-value'>Monday – Friday, 8 a.m. – 5 p.m.</span>{ /* What: Hours Value Span Element. Why: This is the detail itself. How: This shows the weekday hours. */ }


							</div>


						</div>


					</div>



					<a
						className='contact__phone-btn fade-up'

						href='tel:7853041957'
					>{ /* What: Contact Phone Button Anchor Element. Why: Calling is the fastest way to get a quote. How: This dials the number on phones, styled as a button. */ }
						Call Now: (785) 304-1957
					</a>


				</div>



				<div className='contact__form-wrap fade-up'>{ /* What: Contact Form Wrap Div Element. Why: The form and its thank-you message share one panel. How: This holds whichever is showing, and fades in as one block. */ }


					{ forSenBoo ? ( // What: Sent Message Branch. Why: A just-sent form gives way to a thank-you. How: This shows the message while forSenBoo is true.


						<div className='contact__success'>{ /* What: Contact Success Div Element. Why: The visitor should know the form went through. How: This stacks a check, a heading, and a note. */ }


							<span className='contact__success-icon'>✓</span>{ /* What: Success Icon Span Element. Why: A check mark signals success at a glance. How: This shows it large. */ }

							<h3 className='contact__success-title'>Message Sent!</h3>{ /* What: Success Title Heading Element. Why: The message needs a clear heading. How: This is the panel's h3. */ }

							<p className='contact__success-body'>{ /* What: Success Body Paragraph Element. Why: The visitor should know what happens next. How: This says the company will be in touch. */ }
								Thank you for reaching out. Seal and Shield will be in touch shortly.
							</p>


						</div>


					) : ( // What: Quote Form Branch. Why: The form shows whenever it hasn't just been sent. How: This renders the quote request form.


						<form
							className='contact__form'

							data-netlify='true'
							name='contactForm'

							onSubmit={ forSubFun }
						>{ /* What: Contact Form Element. Why: Visitors request a free quote here. How: Its name, contactForm, matches the hidden copy Netlify reads, the browser checks the required fields before submitting, and forSubFun sends it. */ }


							<h3 className='contact__form-title'>Free Quote Request</h3>{ /* What: Form Title Heading Element. Why: The form needs a clear heading. How: This is the panel's h3. */ }



							<div className='contact__form-row'>{ /* What: Name Company Row Div Element. Why: Short fields pair up on wide screens. How: This holds the name and company fields side by side. */ }


								<div className='contact__field'>{ /* What: Name Field Div Element. Why: Each field stacks its label over its input. How: This holds the name field. */ }


									<label htmlFor='conNamInp'>Full Name *</label>{ /* What: Name Label Element. Why: Every field needs a visible label. How: This names the field and marks it required. */ }

									<input
										id='conNamInp'

										name='name'

										placeholder='John Smith'
										required
										type='text'
										value={ forDatObj.name }

										onChange={ fieChaFun }
									/>{ /* What: Contact Name Input Element. Why: The company needs to know who's asking. How: Its name, name, is the key Netlify records and forDatObj holds. */ }


								</div>

								<div className='contact__field'>{ /* What: Company Field Div Element. Why: Each field stacks its label over its input. How: This holds the company field. */ }


									<label htmlFor='conComInp'>Company</label>{ /* What: Company Label Element. Why: Every field needs a visible label. How: This names the field. */ }

									<input
										id='conComInp'

										name='company'

										placeholder='ABC Business LLC'
										type='text'
										value={ forDatObj.company }

										onChange={ fieChaFun }
									/>{ /* What: Contact Company Input Element. Why: Commercial work is for a business. How: Its name, company, is the key Netlify records and forDatObj holds. */ }


								</div>


							</div>



							<div className='contact__form-row'>{ /* What: Phone Email Row Div Element. Why: Short fields pair up on wide screens. How: This holds the phone and email fields side by side. */ }


								<div className='contact__field'>{ /* What: Phone Field Div Element. Why: Each field stacks its label over its input. How: This holds the phone field. */ }


									<label htmlFor='conPhoInp'>Phone *</label>{ /* What: Phone Label Element. Why: Every field needs a visible label. How: This names the field and marks it required. */ }

									<input
										id='conPhoInp'

										name='phone'

										placeholder='(555) 000-0000'
										required
										type='tel'
										value={ forDatObj.phone }

										onChange={ fieChaFun }
									/>{ /* What: Contact Phone Input Element. Why: The company calls back to schedule an inspection. How: Its name, phone, is the key Netlify records and forDatObj holds. */ }


								</div>

								<div className='contact__field'>{ /* What: Email Field Div Element. Why: Each field stacks its label over its input. How: This holds the email field. */ }


									<label htmlFor='conEmaInp'>Email</label>{ /* What: Email Label Element. Why: Every field needs a visible label. How: This names the field. */ }

									<input
										id='conEmaInp'

										name='email'

										placeholder='john@example.com'
										type='email'
										value={ forDatObj.email }

										onChange={ fieChaFun }
									/>{ /* What: Contact Email Input Element. Why: Some visitors would rather hear back by email. How: Its name, email, is the key Netlify records and forDatObj holds. */ }


								</div>


							</div>



							<div className='contact__field contact__field--full'>{ /* What: Message Field Div Element. Why: The message needs the form's full width. How: This holds the message field across both columns. */ }


								<label htmlFor='conMesTex'>Tell us about your roof</label>{ /* What: Message Label Element. Why: Every field needs a visible label. How: This invites the visitor to describe the job. */ }

								<textarea
									id='conMesTex'

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

							<button
								className='contact__submit'

								type='submit'
							>{ /* What: Contact Submit Button Element. Why: The visitor sends the request here. How: This submits the form through forSubFun. */ }
								Submit Free Quote Request
							</button>

							<p className='contact__form-note'>{ /* What: Form Note Paragraph Element. Why: Visitors worry about what happens to their details. How: This promises no spam. */ }
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


