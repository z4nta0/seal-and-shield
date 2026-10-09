


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
 * carries noindex, and each page has exactly one h1. robots.txt lets every
 * crawler in and names the sitemap, which lists the home page alone.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const LIV_URL_STR = 'https://sealandshieldroof.com/'; // What: Live URL String. Why: The canonical link, structured data, and sitemap must all name the live address. How: This is the address they're compared with.

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


} );



test( 'the structured data matches what the page shows', async ( { page : curPagObj } ) => { // What: Structured Data Test. Why: Search engines may show the business's details from its JSON-LD, so every claim in it has to be true and visible on the page. How: This reads the JSON-LD and checks each detail against the page's own text.


	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The structured data lives on the home page. How: This loads the root path.


	const ldjTexStr = await curPagObj.locator( 'script[type="application/ld+json"]' ).textContent() ?? '{}'; // What: Linked-Data-JSON Text String. Why: The structured data is read as written in the page. How: This reads the script's text, or an empty object if it's missing.

	const ldjDatObj = JSON.parse( ldjTexStr ); // What: Linked-Data-JSON Data Object. Why: Each field is checked on its own. How: This parses the text into an object.

	const pagTexStr = await curPagObj.locator( 'body' ).textContent() ?? ''; // What: Page Text String. Why: Every claim has to appear on the page. How: This reads the page's text as written, before CSS uppercases any of it.

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



// #region Crawler File Checks

test( 'robots.txt lets crawlers in and names the sitemap', async ( { request : reqConObj } ) => { // What: Robots File Test. Why: A real business wants every page crawled and its sitemap found. How: This fetches robots.txt and checks its rules.


	const robResObj = await reqConObj.get( '/robots.txt' ); // What: Robots Response Object. Why: The file is read the way a crawler reads it. How: This fetches it from the site.

	const robTexStr = await robResObj.text(); // What: Robots Text String. Why: The rules are checked as written. How: This reads the response body.


	expect( robResObj.ok() ).toBe( true ); // What: Robots Served Assertion. Why: A missing robots.txt would fall through to the app. How: This checks the file is served.

	expect( robTexStr ).toMatch( /User-agent: \*\nAllow: \// ); // What: Allow All Assertion. Why: Every crawler should be let in. How: This checks the wildcard group allows the whole site.

	expect( robTexStr ).not.toMatch( /Disallow: \// ); // What: No Block Assertion. Why: Nothing should be blocked from crawling. How: This checks no group disallows the site.

	expect( robTexStr ).toContain( `Sitemap: ${ LIV_URL_STR }sitemap.xml` ); // What: Sitemap Line Assertion. Why: Crawlers find the sitemap from here. How: This checks it names the sitemap's absolute address.


} );



test( 'the sitemap lists the home page alone', async ( { request : reqConObj } ) => { // What: Sitemap Test. Why: The sitemap should list every indexable page and nothing else. How: This fetches it and checks its one entry.


	const sitResObj = await reqConObj.get( '/sitemap.xml' ); // What: Sitemap Response Object. Why: The file is read the way a crawler reads it. How: This fetches it from the site.

	const sitTexStr = await sitResObj.text(); // What: Sitemap Text String. Why: Its entries are checked as written. How: This reads the response body.


	expect( sitResObj.ok() ).toBe( true ); // What: Sitemap Served Assertion. Why: A missing sitemap would fall through to the app. How: This checks the file is served.

	expect( sitTexStr.match( /<loc>([^<]*)<\/loc>/g ) ).toEqual( [ `<loc>${ LIV_URL_STR }</loc>` ] ); // What: Home Entry Assertion. Why: The home page is the only indexable page. How: This checks the sitemap's entries are exactly its canonical address.


} );

// #endregion Crawler File Checks

// #endregion Module Init


