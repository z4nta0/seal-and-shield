


// #region Imports

import { useEffect } from 'react'; // What: Use Effect. Why: The section is observed once it mounts and released when it unmounts. How: This runs the observer setup and its cleanup.
import { useRef    } from 'react'; // What: Use Ref. Why: The observer needs the section's element. How: This creates the ref the section attaches.

// #endregion Imports



/**
 * reveal.ts = Scroll Reveal
 *
 * @summary
 * The scroll-triggered fade-in the services, about, and contact sections
 * share. Each of them marks the blocks that should fade in with the fade-up
 * class, which styles.css starts hidden and slightly lowered, and attaches
 * the ref this hook returns. Once a tenth of the section enters the
 * viewport, every fade-up block inside it gains the visible class one after
 * another, on a stagger the section chooses, which fades it up into place.
 *
 * Sections:
 *  - Hooks
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Hooks

// #region useRevSecFun

/**
 * useRevSecFun = Use Reveal Section Function
 *
 * @summary
 * Watches the section its returned ref is attached to. Whenever at least a
 * tenth of the section is in view, it adds the visible class to each of the
 * section's fade-up blocks in document order, waiting staDelNum
 * milliseconds longer for each block than the one before, so they fade in
 * one after another. The observer keeps watching after the first reveal,
 * so scrolling the section back into view repeats the additions, which
 * change nothing once every block is visible. The observer disconnects when
 * the section unmounts; a block's pending stagger timer still runs.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param staDelNum - Stagger Delay Number: The extra wait, in milliseconds,
 *                    before each block after the first fades in.
 *
 * @returns The ref to attach to the section element.
 * @see {@link secEleRef}
 *
 * @example
 * ```ts
 * useRevSecFun(80) // => secEleRef
 * ```
 *
*/

function useRevSecFun ( staDelNum : number ) : React.RefObject< HTMLElement | null > {


	const secEleRef = useRef< HTMLElement >( null ); // What: Section Element Reference. Why: The observer watches the section this ref is attached to. How: This holds the section's element once it mounts.


	useEffect( () => { // What: Reveal Observer Effect. Why: The section's blocks fade in once it scrolls into view. How: This observes the section on mount and disconnects on unmount.


		const intObsObj = new IntersectionObserver( ( entObsArr ) => { // What: Intersection Observer Object. Why: The browser reports when the section enters the viewport. How: This reveals the section's blocks each time it does.


			entObsArr.forEach( ( entCurObj ) => { // What: Entry Loop. Why: The observer reports its targets in a batch. How: This handles each entry, though only the section is observed.


				if ( entCurObj.isIntersecting ) { // What: In View Check. Why: Blocks reveal only while the section is in view. How: This skips entries reporting the section leaving.


					entCurObj.target.querySelectorAll( '.fade-up' ).forEach( ( fadCurEle, fadIndNum ) => { // What: Fade Block Loop. Why: Each block fades in on its own beat. How: This schedules each fade-up block in document order.


						setTimeout( () => fadCurEle.classList.add( 'visible' ), fadIndNum * staDelNum ); // What: Staggered Reveal Timer. Why: The blocks fade in one after another. How: This adds the visible class after the block's place in the order times the stagger.


					} );


				}


			} );


		}, { threshold : 0.1 } ); // What: Observer Options. Why: A section should start revealing as soon as a little of it shows. How: This fires once a tenth of it is in view.


		if ( secEleRef.current ) intObsObj.observe( secEleRef.current ); // What: Section Observe Call. Why: The observer has to watch the section. How: This starts observing it once the ref holds its element.



		return () => intObsObj.disconnect(); // What: Observer Cleanup. Why: An unmounted section shouldn't keep being watched. How: This disconnects the observer.


	}, [ staDelNum ] ); // What: Effect Dependency Array. Why: A section's stagger never changes, so the observer is set up once. How: Listing staDelNum would rebuild the observer only if a section ever passed a different stagger.



	return secEleRef; // What: Section Element Reference Return. Why: The section attaches it to its own element. How: This hands back the ref the observer reads.


}

// #endregion useRevSecFun

// #endregion Hooks



// #region Exports

export { useRevSecFun }; // What: Named Exports. Why: The services, about, and contact sections share the fade-in. How: This exports useRevSecFun.

// #endregion Exports


