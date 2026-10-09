


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the page says what it should. How: This asserts on the page's head, its text, and the crawler files.
import { test   } from '@playwright/test'; // What: Test. Why: Each route and each file is its own test. How: This declares them.

// #endregion Imports



/**
 * head.spec.ts = Head Spec
 *
 * @summary
 * Checks the site's SEO setup in whichever engine the project runs. Seal and
 * Shield is a real local business, so the home page has to be findable and
 * describe the company accurately: its title and description name the city
 * and services, its canonical and author tags are in place, it carries no
 * noindex, and its RoofingContractor structured data matches what the page
 * itself shows, its phone number, city, hours, and service areas, with no
 * street address, since the company has none to publish. The 404 page
 * carries noindex, and each page has exactly one h1. The social preview
 * tags are complete, use absolute addresses, and match the page's title and
 * description; the card they point at is a 1,200x630 PNG under 300 KB; and
 * every icon the head links to is served at the size its link promises.
 * robots.txt lets every crawler in and names the sitemap, which lists the
 * home page alone.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const LIV_URL_STR = 'https://sealandshieldroof.com/'; // What: Live URL String. Why: The canonical link, structured data, sitemap, and social tags must all name the live address. How: This is the address they're compared with.



const SOC_KEY_ARR = [ // What: Social Key Array. Why: The social preview rule lists every tag a complete card needs. How: Each entry names one Open Graph or Twitter tag the page must carry.


	'og:description',      // What: Open Graph Description Key. Why: Every card needs the summary under the title. How: This names the tag.
	'og:image',            // What: Open Graph Image Key. Why: Every card needs the preview image. How: This names the tag.
	'og:image:alt',        // What: Open Graph Image Alt Key. Why: Every card needs the image's description for screen readers. How: This names the tag.
	'og:image:height',     // What: Open Graph Image Height Key. Why: Every card needs the image's height, for laying out the card early. How: This names the tag.
	'og:image:type',       // What: Open Graph Image Type Key. Why: Every card needs the image's file type. How: This names the tag.
	'og:image:width',      // What: Open Graph Image Width Key. Why: Every card needs the image's width, for laying out the card early. How: This names the tag.
	'og:locale',           // What: Open Graph Locale Key. Why: Every card needs the page's language. How: This names the tag.
	'og:site_name',        // What: Open Graph Site Name Key. Why: Every card needs the name of the site the link belongs to. How: This names the tag.
	'og:title',            // What: Open Graph Title Key. Why: Every card needs the card's title. How: This names the tag.
	'og:type',             // What: Open Graph Type Key. Why: Every card needs what kind of page it is. How: This names the tag.
	'og:url',              // What: Open Graph URL Key. Why: Every card needs the address shares should count toward. How: This names the tag.
	'twitter:card',        // What: Twitter Card Key. Why: Every card needs the layout X and similar apps use. How: This names the tag.
	'twitter:description', // What: Twitter Description Key. Why: Every card needs the summary on X. How: This names the tag.
	'twitter:image',       // What: Twitter Image Key. Why: Every card needs the image on X. How: This names the tag.
	'twitter:image:alt',   // What: Twitter Image Alt Key. Why: Every card needs the image's description on X. How: This names the tag.
	'twitter:title'        // What: Twitter Title Key. Why: Every card needs the card's title on X. How: This names the tag.


];

// #endregion Constants



// #region Module Init

// #region Home Page Checks

test( 'the home page names the city, the services, and the business', async ( { page : curPagObj } ) => { // What: Home Head Test. Why: Search listings show the title and description, and local searches look for the city. How: This loads the home page and checks its title, description, author, canonical, and robots tags.


	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The checks read the home page's head. How: This loads the root path.


	const desConStr = await curPagObj.locator( 'meta[name="description"]' ).getAttribute( 'content' ) ?? ''; // What: Description Content String. Why: The description's wording and length are both checked. How: This reads the tag's content, or an empty string if it's missing.


	await expect( curPagObj ).toHaveTitle( /Lawrence, KS/ ); // What: Title City Assertion. Why: Local searches look for the city. How: This checks the title names it.

	expect( ( await curPagObj.title() ).length ).toBeLessThanOrEqual( 60 ); // What: Title Length Assertion. Why: Search listings and link cards cut long titles off. How: This keeps it to 60 characters or fewer.

	expect( desConStr ).toContain( 'Lawrence, Kansas' ); // What: Description City Assertion. Why: The summary should say where the company works. How: This checks the description names the city.

	expect( desConStr.length ).toBeGreaterThanOrEqual( 100 ); // What: Description Minimum Assertion. Why: A summary that's too short wastes the space a listing gives it. How: This checks it runs at least 100 characters.

	expect( desConStr.length ).toBeLessThanOrEqual( 125 ); // What: Description Maximum Assertion. Why: Phones cut a summary off around 125 characters. How: This checks it stays within that.

	await expect( curPagObj.locator( 'meta[name="author"]' ) ).toHaveAttribute( 'content', 'Seal and Shield LLC' ); // What: Author Assertion. Why: A real business's site names the business as its author. How: This checks the author tag.

	await expect( curPagObj.locator( 'link[rel="canonical"]' ) ).toHaveAttribute( 'href', LIV_URL_STR ); // What: Canonical Assertion. Why: Every address Netlify serves the site at should count as the live one. How: This checks the canonical link names the live address.

	await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveCount( 0 ); // What: Indexable Assertion. Why: The home page has to stay findable. How: This checks it carries no robots tag that could keep it out.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveCount( 1 ); // What: Single Heading Assertion. Why: One h1 tells search engines and screen readers what the page is about. How: This checks there's exactly one.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toContainText( 'Lawrence, KS' ); // What: Heading City Assertion. Why: Search engines weigh the main heading's words, and local searches look for the city. How: This checks the h1 names it.


} );



test( 'the structured data matches what the page shows', async ( { page : curPagObj } ) => { // What: Structured Data Test. Why: Search engines may show the business's details from its JSON-LD, so every claim in it has to be true and visible on the page. How: This reads the JSON-LD and checks each detail against the page's own text.


	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The structured data lives on the home page. How: This loads the root path.


	const ldjTexStr = await curPagObj.locator( 'script[type="application/ld+json"]' ).textContent() ?? '{}';                                                           // What: Linked-Data-JSON Text String. Why: The structured data is read as written in the page. How: This reads the script's text, or an empty object if it's missing.
	const ldjDatObj = JSON.parse( ldjTexStr ); // What: Linked-Data-JSON Data Object. Why: Each field is checked on its own. How: This parses the text into an object.
	const pagTexStr = await curPagObj.locator( 'body' ).textContent() ?? '';                                                                                           // What: Page Text String. Why: Every claim has to appear on the page. How: This reads the page's text as written, before CSS uppercases any of it.
	const telHreArr = await curPagObj.locator( 'a[href^="tel:"]' ).evaluateAll( ( ancEleArr ) => ancEleArr.map( ( ancCurEle ) => ancCurEle.getAttribute( 'href' ) ) ); // What: Telephone Href Array. Why: The structured data's phone has to be the number the page's call links dial. How: This collects every call link's address.


	expect( ldjDatObj[ '@type' ] ).toBe( 'RoofingContractor' ); // What: Business Type Assertion. Why: The most specific type tells search engines what kind of business this is. How: This checks for RoofingContractor.

	expect( ldjDatObj.name ).toBe( 'Seal and Shield' ); // What: Business Name Assertion. Why: The name has to match the one the site uses everywhere. How: This checks it.

	expect( ldjDatObj.url ).toBe( LIV_URL_STR ); // What: Business URL Assertion. Why: The data should name the live address. How: This checks it.

	expect( telHreArr.length ).toBeGreaterThan( 0 ); // What: Call Link Presence Assertion. Why: A phone in the data is only honest if the page offers it. How: This checks the page has call links.


	for ( const telHreStr of telHreArr ) expect( telHreStr?.replace( /\D/g, '' ) ).toBe( ldjDatObj.telephone.replace( /\D/g, '' ).replace( /^1/, '' ) ); // What: Phone Match Assertion. Why: Every call link and the data must dial the same number. How: This compares their digits, dropping the data's leading country code.



	expect( pagTexStr ).toContain( '(785) 304-1957' ); // What: Phone Shown Assertion. Why: The number in the data has to be visible on the page. How: This checks the page shows it.

	expect( ldjDatObj.address.addressLocality ).toBe( 'Lawrence' ); // What: City Assertion. Why: The business is based in Lawrence. How: This checks the data's city.

	expect( ldjDatObj.address.streetAddress ).toBeUndefined(); // What: No Street Assertion. Why: The company has no business address to publish, only the owner's home. How: This checks the data leaves the street out.

	expect( pagTexStr ).toContain( 'Lawrence, Kansas' ); // What: City Shown Assertion. Why: The city in the data has to be visible on the page. How: This checks the page shows it.

	expect( ldjDatObj.openingHoursSpecification[ 0 ] ).toMatchObject( { closes : '17:00', dayOfWeek : [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ], opens : '08:00' } ); // What: Hours Assertion. Why: The data should give the hours the page shows. How: This checks weekdays from 8:00 to 17:00.

	expect( pagTexStr ).toContain( 'Monday – Friday, 8 a.m. – 5 p.m.' ); // What: Hours Shown Assertion. Why: The hours in the data have to be visible on the page. How: This checks the page shows them.

	expect( ldjDatObj.areaServed ).toHaveLength( 5 ); // What: Service Area Count Assertion. Why: The data should list exactly the service areas the page lists. How: This checks there are five.


	for ( const areNamStr of [ 'Lawrence, KS', 'Topeka, KS', 'Kansas City Metro', 'All of Kansas', 'Continental U.S.' ] ) expect( pagTexStr ).toContain( areNamStr ); // What: Service Areas Shown Assertion. Why: Each area in the data has to appear on the page. How: This checks every one of the Services section's area tags.


} );

// #endregion Home Page Checks



// #region Not Found Page Checks

test( 'the 404 page stays out of search results', async ( { page : curPagObj } ) => { // What: Not Found Head Test. Why: The host answers every unknown address with a 200, so the 404 page must ask not to be indexed. How: This loads an unknown address and checks its robots tag, title, and heading.


	await curPagObj.goto( '/no-such-page' ); // What: Unknown Address Open Call. Why: Every unknown path shows the 404 page. How: This loads one.


	await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveAttribute( 'content', 'noindex' ); // What: Noindex Assertion. Why: Search engines must leave the page out. How: This checks the robots tag.

	await expect( curPagObj ).toHaveTitle( 'Page Not Found | Seal and Shield' ); // What: Not Found Title Assertion. Why: The page needs a title of its own. How: This checks it.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveCount( 1 ); // What: Single Heading Assertion. Why: Every page should have exactly one h1. How: This checks the 404 page has one.


} );

// #endregion Not Found Page Checks



// #region Social Preview Checks

test( 'the social preview tags are complete', async ( { page : curPagObj } ) => { // What: Social Tags Test. Why: A link shared anywhere should show a full card that matches the page. How: This loads the home page and checks every social tag, its absolute URLs, and its copy against the page's own title and description.


	await curPagObj.goto( '/' ); // What: Home Load Call. Why: Link scrapers read the page every route shares. How: This opens the home page.


	const socTagArr = await curPagObj.locator( 'meta[property^="og:"], meta[name^="twitter:"]' ).evaluateAll( ( tagEleArr ) => tagEleArr.map( ( tagCurEle ) => [ tagCurEle.getAttribute( 'property' ) || tagCurEle.getAttribute( 'name' ) || '', tagCurEle.getAttribute( 'content' ) || '' ] ) ); // What: Social Tag Array. Why: Every social tag is checked by its key and value. How: This reads each Open Graph and Twitter tag as a key and content pair.
	const socTagObj = Object.fromEntries( socTagArr ); // What: Social Tag Object. Why: Tags are easier to check by key. How: This turns the pairs into an object.


	expect( Object.keys( socTagObj ) ).toEqual( expect.arrayContaining( SOC_KEY_ARR ) ); // What: Complete Tags Assertion. Why: A missing tag leaves part of the card blank. How: This checks every required key is present, allowing optional extras.

	expect( [ socTagObj[ 'og:image' ], socTagObj[ 'og:url' ], socTagObj[ 'twitter:image' ] ] ).toEqual( [ `${ LIV_URL_STR }og-image.png`, LIV_URL_STR, `${ LIV_URL_STR }og-image.png` ] ); // What: Absolute URLs Assertion. Why: Scrapers can't resolve a relative address. How: This checks each URL tag names the live https address.

	expect( [ socTagObj[ 'og:image:type' ], socTagObj[ 'og:image:width' ], socTagObj[ 'og:image:height' ] ] ).toEqual( [ 'image/png', '1200', '630' ] ); // What: Image Facts Assertion. Why: The tags have to describe the file they point at. How: This checks the type and size they give.

	expect( [ socTagObj[ 'og:title' ], socTagObj[ 'twitter:title' ] ] ).toEqual( [ await curPagObj.title(), await curPagObj.title() ] ); // What: Title Match Assertion. Why: A card should name the page the way its tab does. How: This checks both card titles match the page title.

	expect( [ socTagObj[ 'og:description' ], socTagObj[ 'twitter:description' ] ] ).toEqual( Array( 2 ).fill( await curPagObj.locator( 'meta[name="description"]' ).getAttribute( 'content' ) ) ); // What: Description Match Assertion. Why: A card should sum the page up the way its search listing does. How: This checks both card descriptions match the page's description.


} );



test( 'the social preview image is a 1,200x630 PNG under 300 KB', async ( { request : reqConObj } ) => { // What: Preview Image Test. Why: The social tags promise a 1,200x630 card small enough for WhatsApp. How: This fetches the image, checks its byte count, and reads its size from the PNG header.


	const imaResObj = await reqConObj.get( '/og-image.png' ); // What: Image Response Object. Why: The image has to exist where the tags point. How: This fetches it from the site.
	const pngBufObj = await imaResObj.body();                 // What: PNG Buffer Object. Why: The image's size is written in its header. How: This reads the response bytes.


	expect( imaResObj.headers()[ 'content-type' ] ).toBe( 'image/png' ); // What: PNG Type Assertion. Why: The tags promise a PNG. How: This checks the served type.

	expect( pngBufObj.length ).toBeLessThan( 300 * 1024 ); // What: PNG Bytes Assertion. Why: WhatsApp drops a preview image of 300 KB or more. How: This checks the file's byte count.

	expect( [ pngBufObj.readUInt32BE( 16 ), pngBufObj.readUInt32BE( 20 ) ] ).toEqual( [ 1200, 630 ] ); // What: PNG Size Assertion. Why: The tags promise 1,200 by 630 pixels. How: This reads the width and height a PNG stores at bytes 16 and 20.


} );



test( 'every icon the head links to is served at its size', async ( { page : curPagObj, request : reqConObj } ) => { // What: Icons Test. Why: Browsers and apps fetch the icons the head names, and a missing or wrong-sized one shows a blank or blurry mark. How: This reads every icon link and checks each file exists and, for PNGs, has the size its link promises.


	await curPagObj.goto( '/' ); // What: Home Load Call. Why: The icon links live in the page's head. How: This opens the home page.


	const icoLinArr = await curPagObj.locator( 'link[rel="icon"], link[rel="apple-touch-icon"]' ).evaluateAll( ( linEleArr ) => linEleArr.map( ( linCurEle ) => [ linCurEle.getAttribute( 'href' ) || '', linCurEle.getAttribute( 'sizes' ) || '' ] ) ); // What: Icon Link Array. Why: Each icon is checked against its own link. How: This reads every icon link's address and size.


	expect( icoLinArr.length ).toBe( 6 ); // What: Icon Count Assertion. Why: The set is the ICO, four PNG sizes, and the Apple touch icon. How: This checks all six are linked.


	for ( const [ icoHreStr, icoSizStr ] of icoLinArr ) { // What: Icon Check Loop. Why: Every linked icon has to be real. How: This fetches each one in turn.


		const icoResObj = await reqConObj.get( icoHreStr ); // What: Icon Response Object. Why: The icon has to exist where its link points. How: This fetches it.
		const icoBufObj = await icoResObj.body();           // What: Icon Buffer Object. Why: A PNG's size is written in its header. How: This reads the bytes.


		expect( icoResObj.ok() ).toBe( true ); // What: Icon Served Assertion. Why: A missing icon falls through to the app's HTML. How: This checks the file is served.



		if ( icoSizStr === 'any' ) { // What: ICO Header Guard. Why: favicon.ico isn't a PNG and has no single size. How: This checks its header marks it an icon file and moves on.


			expect( icoBufObj.readUInt16LE( 2 ) ).toBe( 1 ); // What: ICO Type Assertion. Why: The file has to be a real icon file. How: This checks its header's type field reads 1.



			continue; // What: ICO Skip. Why: The PNG size check below doesn't apply to it. How: This moves on to the next icon.


		}



		expect( `${ icoBufObj.readUInt32BE( 16 ) }x${ icoBufObj.readUInt32BE( 20 ) }` ).toBe( icoSizStr ); // What: PNG Icon Size Assertion. Why: Each PNG should be the size its link promises. How: This reads the width and height from its header.


	}


} );

// #endregion Social Preview Checks



// #region Crawler File Checks

test( 'robots.txt lets crawlers in and names the sitemap', async ( { request : reqConObj } ) => { // What: Robots File Test. Why: A real business wants every page crawled and its sitemap found. How: This fetches robots.txt and checks its rules.


	const robResObj = await reqConObj.get( '/robots.txt' ); // What: Robots Response Object. Why: The file is read the way a crawler reads it. How: This fetches it from the site.
	const robTexStr = await robResObj.text();               // What: Robots Text String. Why: The rules are checked as written. How: This reads the response body.


	expect( robResObj.ok() ).toBe( true ); // What: Robots Served Assertion. Why: A missing robots.txt would fall through to the app. How: This checks the file is served.

	expect( robTexStr ).toMatch( /User-agent: \*\nAllow: \// ); // What: Allow All Assertion. Why: Every crawler should be let in. How: This checks the wildcard group allows the whole site.

	expect( robTexStr ).not.toMatch( /Disallow: \// ); // What: No Block Assertion. Why: Nothing should be blocked from crawling. How: This checks no group disallows the site.

	expect( robTexStr ).toContain( `Sitemap: ${ LIV_URL_STR }sitemap.xml` ); // What: Sitemap Line Assertion. Why: Crawlers find the sitemap from here. How: This checks it names the sitemap's absolute address.


} );



test( 'the sitemap lists the home page alone', async ( { request : reqConObj } ) => { // What: Sitemap Test. Why: The sitemap should list every indexable page and nothing else. How: This fetches it and checks its one entry.


	const sitResObj = await reqConObj.get( '/sitemap.xml' ); // What: Sitemap Response Object. Why: The file is read the way a crawler reads it. How: This fetches it from the site.
	const sitTexStr = await sitResObj.text();                // What: Sitemap Text String. Why: Its entries are checked as written. How: This reads the response body.


	expect( sitResObj.ok() ).toBe( true ); // What: Sitemap Served Assertion. Why: A missing sitemap would fall through to the app. How: This checks the file is served.

	expect( sitTexStr.match( /<loc>([^<]*)<\/loc>/g ) ).toEqual( [ `<loc>${ LIV_URL_STR }</loc>` ] ); // What: Home Entry Assertion. Why: The home page is the only indexable page. How: This checks the sitemap's entries are exactly its canonical address.


} );

// #endregion Crawler File Checks

// #endregion Module Init


