


// #region Imports

import { chromium      } from '@playwright/test'; // What: Chromium. Why: The logos are resized and encoded in a real browser's canvas, the one image tool every machine running the tests already has. How: This launches Playwright's Chromium.
import { readFileSync  } from 'node:fs';          // What: Read File Sync. Why: Each original is handed to the browser as data. How: This reads it from design/logos.
import { writeFileSync } from 'node:fs';          // What: Write File Sync. Why: Each finished logo is saved into src/. How: This writes its bytes.

// #endregion Imports



/**
 * render.mts = Logo Renderer
 *
 * @summary
 * Rebuilds the site's two logos in src/ from the originals beside this
 * script: the full logo (4,763x4,640) at 968x943, under 3x its widest
 * drawing of about 628px, as lossy WebP at 0.95 quality, the lowest that
 * shows no difference at 3x zoom, and the simple mark (1,210x1,025) at
 * 131x111, under 3x the 44.876px box the bar and footer draw it in, as
 * lossless WebP, since lossy encoding showed on its fine detail. Each size
 * keeps the original's proportions to within about 0.01px where it's drawn.
 * The image is drawn down in halving steps with high-quality smoothing, so
 * fine edges stay crisp. Run it with npm run logos whenever a logo changes,
 * then update the images' width and height attributes if a size moved.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type LogRecTyp = { // What: Logo Record Type. Why: Every logo is described the same way. How: This names its original, its output, its size, and its encoding quality.


	heiNum : number, // What: Height Number. Why: The logo is drawn at a fixed height. How: This is its height in pixels.
	outStr : string, // What: Output String. Why: Each logo is imported from its own place in src/. How: This is its path from this script's folder.
	quaNum : number, // What: Quality Number. Why: The full logo takes lossy WebP and the mark lossless. How: This is the encoder's quality, where 1 asks Chromium for lossless WebP.
	souStr : string, // What: Source String. Why: Each logo is rendered from its own original. How: This is the original's file name beside this script.
	widNum : number  // What: Width Number. Why: The logo is drawn at a fixed width. How: This is its width in pixels.


};

// #endregion Types



// #region Constants

// #region LOG_REC_ARR

/**
 * LOG_REC_ARR = Logo Record Array
 *
 * @summary
 * The logos rendered from the originals, in the order they're written. Every
 * row shares one shape, so its fields carry no comments of their own:
 *
 * - `heiNum` (Number): Height Number, the logo's height in pixels.
 *
 * - `outStr` (String): Output String, the logo's path in src/ from this
 *   script's folder.
 *
 * - `quaNum` (Number): Quality Number, the WebP encoder's quality, where 1
 *   asks Chromium for lossless encoding.
 *
 * - `souStr` (String): Source String, the original's file name beside this
 *   script.
 *
 * - `widNum` (Number): Width Number, the logo's width in pixels.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const LOG_REC_ARR : LogRecTyp[] = [ // What: Logo Record Array. Why: Both logos are rendered from one list. How: Each row names an original, its output, its size, and its quality.


	{ heiNum : 943, outStr : '../../src/pages/home/logo-full.webp', quaNum : 0.95, souStr : 'logo-full.png',   widNum : 968 }, // What: Full Logo Row. Why: The hero and About show the full logo, never wider than about 628px. How: This renders it at 968x943 as lossy WebP.
	{ heiNum : 111, outStr : '../../src/assets/logo-simple.webp',   quaNum : 1,    souStr : 'logo-simple.png', widNum : 131 }  // What: Simple Logo Row. Why: The bar and footer draw the mark in a 44.876px box. How: This renders it at 131x111 as lossless WebP.


];

// #endregion LOG_REC_ARR

// #endregion Constants



// #region Module Init

const broInsObj = await chromium.launch();   // What: Browser Instance Object. Why: The logos are drawn and encoded in a real browser's canvas. How: This launches Chromium.
const draPagObj = await broInsObj.newPage(); // What: Draw Page Object. Why: The canvas work runs inside a page. How: This opens a blank one.


// #region renWebFun

/**
 * renWebFun = Render WebP Function
 *
 * @summary
 * Draws one logo at its size inside the browser and returns the WebP's
 * bytes. It halves the original repeatedly with high-quality smoothing until
 * one more halving would pass the target width, then draws the last step at
 * the exact size, which keeps fine edges from aliasing, and encodes the
 * result at the row's quality.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param logRecObj - Logo Record Object: {@link LogRecTyp}
 *
 * @returns A promise that resolves with the finished WebP's bytes.
 *
 * @example
 * ```ts
 * renWebFun(LOG_REC_ARR[0]) // => Buffer
 * ```
 *
*/

async function renWebFun ( logRecObj : LogRecTyp ) : Promise< Buffer > {


	const souB64Str = readFileSync( new URL( logRecObj.souStr, import.meta.url ) ).toString( 'base64' ); // What: Source Base64 String. Why: The browser draws the original from data rather than a file path. How: This reads the original and encodes it.


	const webB64Str = await draPagObj.evaluate( async ( [ souDatStr, tarWidNum, tarHeiNum, encQuaNum ] ) => { // What: WebP Base64 String. Why: The canvas lives in the page, so the finished image comes back as text. How: This runs the drawing in the page and returns the WebP as base64.


		const souImaObj = new Image(); // What: Source Image Object. Why: The original has to be decoded before it's drawn. How: This loads it from its base64 data.


		souImaObj.src = `data:image/png;base64,${ souDatStr }`; // What: Source Address Assignment. Why: The image loads from the data handed in. How: This sets it as a data URL.


		await souImaObj.decode(); // What: Source Decode Wait. Why: Drawing an undecoded image draws nothing. How: This waits until it's ready.


		let curCanObj : HTMLCanvasElement | HTMLImageElement = souImaObj; // What: Current Canvas Object. Why: Each halving step draws from the previous one. How: This starts at the original.

		let curHeiNum = souImaObj.naturalHeight; // What: Current Height Number. Why: Each step halves the height with the width. How: This tracks the current step's height.
		let curWidNum = souImaObj.naturalWidth;  // What: Current Width Number. Why: Halving stops once the next step would pass the target width. How: This tracks the current step's width.


		while ( curWidNum / 2 >= tarWidNum ) { // What: Halving Loop. Why: Shrinking far in one step aliases fine edges. How: This halves the image until one more halving would pass the target width.


			const halCanObj = document.createElement( 'canvas' ); // What: Half Canvas Object. Why: Each step draws into a fresh canvas half the size. How: This creates it.


			curHeiNum = Math.round( curHeiNum / 2 ); // What: Halved Height Update. Why: The step is half the previous height. How: This halves and rounds it.
			curWidNum = Math.round( curWidNum / 2 ); // What: Halved Width Update. Why: The step is half the previous width. How: This halves and rounds it.

			halCanObj.height = curHeiNum; // What: Half Height Assignment. Why: The canvas is sized to the step. How: This sets its height.
			halCanObj.width  = curWidNum; // What: Half Width Assignment. Why: The canvas is sized to the step. How: This sets its width.


			const halCotObj = halCanObj.getContext( '2d' )!; // What: Half Context Object. Why: Drawing goes through the canvas's 2D context. How: This gets it. // What: Non-Null Note. Why: getContext can return null for an unsupported type. How: A 2D context is always available on a fresh canvas.


			halCotObj.imageSmoothingQuality = 'high'; // What: Smoothing Quality Assignment. Why: The best resampling keeps edges clean. How: This asks for high-quality smoothing.


			halCotObj.drawImage( curCanObj, 0, 0, curWidNum, curHeiNum ); // What: Half Draw Call. Why: This is the step itself. How: This draws the previous step at half size.


			curCanObj = halCanObj; // What: Step Advance Assignment. Why: The next step draws from this one. How: This makes it the current image.


		}



		const finCanObj = document.createElement( 'canvas' ); // What: Final Canvas Object. Why: The last step draws at the exact target size. How: This creates it.


		finCanObj.height = tarHeiNum; // What: Final Height Assignment. Why: The logo has its own target size. How: This sets the height.
		finCanObj.width  = tarWidNum; // What: Final Width Assignment. Why: The logo has its own target size. How: This sets the width.


		const finCotObj = finCanObj.getContext( '2d' )!; // What: Final Context Object. Why: Drawing goes through the canvas's 2D context. How: This gets it. // What: Non-Null Note. Why: getContext can return null for an unsupported type. How: A 2D context is always available on a fresh canvas.


		finCotObj.imageSmoothingQuality = 'high'; // What: Final Smoothing Assignment. Why: The last step should resample as cleanly as the others. How: This asks for high-quality smoothing.

		finCotObj.drawImage( curCanObj, 0, 0, tarWidNum, tarHeiNum ); // What: Final Draw Call. Why: This draws the logo itself. How: This draws the last step at the exact size.



		return finCanObj.toDataURL( 'image/webp', encQuaNum ).split( ',' )[ 1 ]; // What: WebP Data Return. Why: The bytes have to leave the page as text. How: This encodes the canvas as WebP at the row's quality and returns its base64 part.


	}, [ souB64Str, logRecObj.widNum, logRecObj.heiNum, logRecObj.quaNum ] as const ); // What: Drawing Arguments. Why: The page can't read this script's variables. How: This hands the original's data, the target width and height, and the quality into the page. // What: Type Assertion Note. Why: Without it the array widens to one mixed type, so the page function's destructured parameters lose their own types. How: as const keeps it a readonly tuple, so each parameter is typed by its position.



	return Buffer.from( webB64Str, 'base64' ); // What: WebP Bytes Return. Why: The caller writes bytes, not text. How: This decodes the base64 WebP into a buffer.


}

// #endregion renWebFun


for ( const logRecObj of LOG_REC_ARR ) writeFileSync( new URL( logRecObj.outStr, import.meta.url ), await renWebFun( logRecObj ) ); // What: Logo Write Loop. Why: Each logo is saved where its components import it. How: This renders every row and writes it into src/.



await broInsObj.close(); // What: Browser Close Call. Why: The script should exit once the logos are saved. How: This shuts Chromium down.

console.log( `Wrote ${ LOG_REC_ARR.length } logos to src/.` ); // What: Result Log Call. Why: The run should say what it wrote. How: This prints the count.

// #endregion Module Init


