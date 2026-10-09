


// #region Imports

import { chromium      } from '@playwright/test'; // What: Chromium. Why: The icons are resized in a real browser's canvas, the one image tool every machine running the tests already has. How: This launches Playwright's Chromium.
import { fileURLToPath } from 'node:url';         // What: File URL To Path. Why: The source and output paths are resolved from this script's own location. How: This turns a file URL into a path.
import { readFileSync  } from 'node:fs';          // What: Read File Sync. Why: The source mark is handed to the browser as data. How: This reads it from design/icons.
import { writeFileSync } from 'node:fs';          // What: Write File Sync. Why: Each finished icon is saved into public/. How: This writes its bytes.

// #endregion Imports



/**
 * render.mts = Favicon Set Renderer
 *
 * @summary
 * Rebuilds the site's favicon set in public/ from mark.png beside this
 * script, the 1,210px simple mark on its white badge with transparent
 * rounded corners: PNG icons at 16, 32, 192, and 512px, a favicon.ico
 * holding the 16, 32, and 48px sizes for older browsers and the request
 * browsers make for /favicon.ico on their own, and a 180px
 * apple-touch-icon.png on a solid white square, since iOS fills
 * transparency with black and rounds the corners itself. Each size is
 * drawn down in halving steps with high-quality smoothing, so even the 16px
 * icon stays crisp. Run it with npm run icons whenever the mark changes.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

type IcoRcdTyp = { // What: Icon Record Type. Why: Every PNG icon is described the same way. How: This names its file, its size, and whether it needs a solid background.


	filStr : string,  // What: File String. Why: Each icon is saved under its own name in public/. How: This is the file name.
	opaBoo : boolean, // What: Opaque Boolean. Why: iOS turns transparent pixels black. How: This is true for the icon drawn on solid white.
	sizNum : number   // What: Size Number. Why: Each icon is square at its own size. How: This is its width and height in pixels.


};
const ICO_RCD_ARR : IcoRcdTyp[] = [ // What: Icon Record Array. Why: The PNG icons the head links to, and the one iOS reads, are rendered from one list. How: Each row names a file and its size.


	{ filStr : 'favicon-16x16.png',    opaBoo : false, sizNum : 16  }, // What: Small Icon Row. Why: Tabs draw small icons crisper at their own size. How: This renders the 16px icon.
	{ filStr : 'favicon-32x32.png',    opaBoo : false, sizNum : 32  }, // What: Medium Icon Row. Why: Most browsers pick a 32px tab icon. How: This renders the 32px icon.
	{ filStr : 'favicon-192x192.png',  opaBoo : false, sizNum : 192 }, // What: Large Icon Row. Why: Android and some browsers use a large icon for shortcuts. How: This renders the 192px icon.
	{ filStr : 'favicon-512x512.png',  opaBoo : false, sizNum : 512 }, // What: Extra Large Icon Row. Why: High-density screens and launchers can ask for a bigger icon still. How: This renders the 512px icon.
	{ filStr : 'apple-touch-icon.png', opaBoo : true,  sizNum : 180 }  // What: Apple Touch Icon Row. Why: iOS draws the home screen icon at 180px and fills transparency with black. How: This renders it on solid white.


];



const ICO_SIZ_ARR = [ 16, 32, 48 ]; // What: ICO Size Array. Why: favicon.ico should hold the sizes older browsers and Windows pick from. How: Each entry is one square size packed into the file.



const OUT_DIR_STR = fileURLToPath( new URL( '../../public/', import.meta.url ) );                  // What: Output Directory String. Why: Browsers request icons from the site's root. How: This resolves public/ from this script's folder.
const SOU_B64_STR = readFileSync( new URL( './mark.png', import.meta.url ) ).toString( 'base64' ); // What: Source Base64 String. Why: The browser draws the mark from data rather than a file path. How: This reads mark.png and encodes it.

// #endregion Constants



// #region Module Init

const broInsObj = await chromium.launch();   // What: Browser Instance Object. Why: The icons are drawn in a real browser's canvas. How: This launches Chromium.
const draPagObj = await broInsObj.newPage(); // What: Draw Page Object. Why: The canvas work runs inside a page. How: This opens a blank one.



// #region renPngFun

/**
 * renPngFun = Render PNG Function
 *
 * @summary
 * Draws the mark at one square size inside the browser and returns the PNG's
 * bytes. It halves the image repeatedly with high-quality smoothing until
 * one more halving would pass the target, then draws the last step at the
 * exact size, which keeps fine edges from aliasing at small sizes. When
 * asked for an opaque icon, it fills the square white before drawing.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param icoSizNum - Icon Size Number: The icon's width and height in pixels.
 * @param icoOpaBoo - Icon Opaque Boolean: Whether to draw on solid white.
 *
 * @returns The finished PNG's bytes.
 *
 * @example
 * ```ts
 * renPngFun(32, false) // => Buffer
 * ```
 *
*/

async function renPngFun ( icoSizNum : number, icoOpaBoo : boolean ) : Promise< Buffer > {


	const pngB64Str = await draPagObj.evaluate( async ( [ souB64Str, tarSizNum, solBacBoo ] ) => { // What: PNG Base64 String. Why: The canvas lives in the page, so the finished image comes back as text. How: This runs the drawing in the page and returns the PNG as base64.


		const souImaObj = new Image(); // What: Source Image Object. Why: The mark has to be decoded before it's drawn. How: This loads it from its base64 data.

		souImaObj.src = `data:image/png;base64,${ souB64Str }`; // What: Source Address Assignment. Why: The image loads from the data handed in. How: This sets it as a data URL.

		await souImaObj.decode(); // What: Source Decode Wait. Why: Drawing an undecoded image draws nothing. How: This waits until it's ready.


		let curCanObj : HTMLCanvasElement | HTMLImageElement = souImaObj; // What: Current Canvas Object. Why: Each halving step draws from the previous one. How: This starts at the source image.

		let curSizNum = souImaObj.naturalWidth; // What: Current Size Number. Why: Halving stops once the next step would pass the target. How: This tracks the current step's size.


		while ( curSizNum / 2 >= tarSizNum ) { // What: Halving Loop. Why: Shrinking far in one step aliases fine edges. How: This halves the image until one more halving would pass the target.


			const halCanObj = document.createElement( 'canvas' ); // What: Half Canvas Object. Why: Each step draws into a fresh canvas half the size. How: This creates it.

			curSizNum = Math.round( curSizNum / 2 ); // What: Halved Size Update. Why: The step is half the previous size. How: This halves and rounds it.

			halCanObj.width = curSizNum; // What: Half Width Assignment. Why: The canvas is square at the step's size. How: This sets its width.

			halCanObj.height = curSizNum; // What: Half Height Assignment. Why: The canvas is square at the step's size. How: This sets its height.


			const halConObj = halCanObj.getContext( '2d' )!; // What: Half Context Object. Why: Drawing goes through the canvas's 2D context. How: This gets it. // What: Non-Null Note. Why: getContext can return null for an unsupported type. How: A 2D context is always available on a fresh canvas.

			halConObj.imageSmoothingQuality = 'high'; // What: Smoothing Quality Assignment. Why: The best resampling keeps edges clean. How: This asks for high-quality smoothing.

			halConObj.drawImage( curCanObj, 0, 0, curSizNum, curSizNum ); // What: Half Draw Call. Why: This is the step itself. How: This draws the previous step at half size.

			curCanObj = halCanObj; // What: Step Advance Assignment. Why: The next step draws from this one. How: This makes it the current image.


		}



		const finCanObj = document.createElement( 'canvas' ); // What: Final Canvas Object. Why: The last step draws at the exact target size. How: This creates it.

		finCanObj.width = tarSizNum; // What: Final Width Assignment. Why: The icon is square at its target size. How: This sets the width.

		finCanObj.height = tarSizNum; // What: Final Height Assignment. Why: The icon is square at its target size. How: This sets the height.


		const finConObj = finCanObj.getContext( '2d' )!; // What: Final Context Object. Why: Drawing goes through the canvas's 2D context. How: This gets it. // What: Non-Null Note. Why: getContext can return null for an unsupported type. How: A 2D context is always available on a fresh canvas.

		finConObj.imageSmoothingQuality = 'high'; // What: Final Smoothing Assignment. Why: The last step should resample as cleanly as the others. How: This asks for high-quality smoothing.


		if ( solBacBoo ) { // What: Solid Background Fill. Why: iOS fills transparency with black. How: For the opaque icon, this paints the square white before the mark goes on.


			finConObj.fillStyle = '#ffffff'; // What: White Fill Assignment. Why: The background has to be solid white. How: This sets the fill color.

			finConObj.fillRect( 0, 0, tarSizNum, tarSizNum ); // What: Background Fill Call. Why: Every pixel under the mark has to be opaque. How: This paints the whole square.


		}



		finConObj.drawImage( curCanObj, 0, 0, tarSizNum, tarSizNum ); // What: Final Draw Call. Why: This draws the icon itself. How: This draws the last step at the exact size.



		return finCanObj.toDataURL( 'image/png' ).split( ',' )[ 1 ]; // What: PNG Data Return. Why: The bytes have to leave the page as text. How: This encodes the canvas as a PNG and returns its base64 part.


	}, [ SOU_B64_STR, icoSizNum, icoOpaBoo ] as const ); // What: Drawing Arguments. Why: The page can't read this script's variables. How: This hands the mark's data, the target size, and the opaque flag into the page. // What: Type Assertion Note. Why: Without it the array widens to one mixed type, so the page function's destructured parameters lose their own types. How: as const keeps it a readonly tuple, so each parameter is typed by its position.



	return Buffer.from( pngB64Str, 'base64' ); // What: PNG Bytes Return. Why: The caller writes bytes, not text. How: This decodes the base64 PNG into a buffer.


}

// #endregion renPngFun



for ( const icoRcdObj of ICO_RCD_ARR ) writeFileSync( OUT_DIR_STR + icoRcdObj.filStr, await renPngFun( icoRcdObj.sizNum, icoRcdObj.opaBoo ) ); // What: PNG Icon Loop. Why: Each PNG icon is saved under its own name. How: This renders every row and writes it into public/.



const icoPngArr = await Promise.all( ICO_SIZ_ARR.map( ( icoSizNum ) => renPngFun( icoSizNum, false ) ) ); // What: ICO PNG Array. Why: favicon.ico packs one PNG per size. How: This renders each of its sizes.
const icoHeaBuf = Buffer.alloc( 6 + 16 * icoPngArr.length );                                              // What: ICO Header Buffer. Why: An ICO file starts with a header and one directory entry per image. How: This allocates both.


icoHeaBuf.writeUInt16LE( 1, 2 );                // What: ICO Type Write. Why: The format marks icons with type 1. How: This writes it after the reserved zero.
icoHeaBuf.writeUInt16LE( icoPngArr.length, 4 ); // What: ICO Count Write. Why: The header says how many images follow. How: This writes the count.


let icoOffNum = icoHeaBuf.length; // What: ICO Offset Number. Why: Each directory entry says where its image starts. How: This begins right after the header and directory.


for ( const [ icoIndNum, icoPngBuf ] of icoPngArr.entries() ) { // What: ICO Entry Loop. Why: Each image needs a directory entry. How: This writes one per size, in order.


	const entOffNum = 6 + 16 * icoIndNum; // What: Entry Offset Number. Why: Each entry has its own place in the directory. How: This finds it.


	icoHeaBuf.writeUInt8( ICO_SIZ_ARR[ icoIndNum ], entOffNum );     // What: Entry Width Write. Why: The entry names the image's width. How: This writes it.
	icoHeaBuf.writeUInt8( ICO_SIZ_ARR[ icoIndNum ], entOffNum + 1 ); // What: Entry Height Write. Why: The entry names the image's height. How: This writes it.
	icoHeaBuf.writeUInt16LE( 1, entOffNum + 4 );                     // What: Entry Planes Write. Why: The format expects one color plane. How: This writes it.
	icoHeaBuf.writeUInt16LE( 32, entOffNum + 6 );                    // What: Entry Depth Write. Why: The images are full-color PNGs with alpha. How: This writes 32 bits per pixel.
	icoHeaBuf.writeUInt32LE( icoPngBuf.length, entOffNum + 8 );      // What: Entry Size Write. Why: The entry says how many bytes its image takes. How: This writes the PNG's length.
	icoHeaBuf.writeUInt32LE( icoOffNum, entOffNum + 12 );            // What: Entry Offset Write. Why: The entry says where its image starts. How: This writes the running offset.


	icoOffNum += icoPngBuf.length; // What: Offset Advance. Why: The next image starts after this one. How: This adds its length.


}



writeFileSync( OUT_DIR_STR + 'favicon.ico', Buffer.concat( [ icoHeaBuf, ...icoPngArr ] ) ); // What: ICO Write Call. Why: Browsers request /favicon.ico on their own. How: This writes the header, directory, and PNGs as one file.

await broInsObj.close(); // What: Browser Close Call. Why: The script should exit once the icons are saved. How: This shuts Chromium down.

console.log( `Wrote ${ ICO_RCD_ARR.length } PNG icons and favicon.ico to ${ OUT_DIR_STR }.` ); // What: Result Log Call. Why: The run should say what it wrote. How: This prints the count and folder.

// #endregion Module Init


