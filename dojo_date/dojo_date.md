---
Category:  Working with Data
...

## Working with Dates in Dojo

Dates can be awkward to work with in JavaScript. This tutorial walks through the use of `dojo/date`&mdash;Dojo's answer to the need for a standard library for date math, comparisons, parsing and formatting.

### Getting Started

Dates can be some of the most complex objects to deal with in any software development environment; there are so many subtle and not-so-subtle issues
with dates (which can introduce ambiguity and error) that even humans frequently get mixed up. The Dojo Core includes utilities in the `dojo/date`
modules to fill in many of the holes with date handling in JavaScript.  If you have to work with dates, the `dojo/date`,
`dojo/date/locale` and `dojo/date/stamp` modules deserve your attention.

We can't cover every method and every option here, so we'll taste a sample from each module to get a flavor of what they offer&mdash;and the kinds of
tasks they can help you with.

### Common Date Operations with `dojo/date`

The functions in the `dojo/date` module make common date-based tasks super easy.  Do you remember the leap year rules?
Is this year a leap year? Was 2000?  Do you use the
[knuckle-count](http://lifehacker.com/232828/macgyver-tip-use-your-knuckles-to-remember-each-months-days) trick to
remember which months have 30/31 days?  Instead, try this:

```js
require(["dojo/date"], function(date){

// ...then:
var date1 = new Date("Feb 01, 2000"),
	date2 = new Date("Jul 21, 1969");

this.showResult("Leap Years",
[
	"Feb 01, 2000: "
		+ date.getDaysInMonth(date1)
		+ " days in the month. Leap year? "
		+ date.isLeapYear(date1),
	"Jul 21, 1969: "
		+ date.getDaysInMonth(date2)
		+ " days in the month. Leap year? "
		+ date.isLeapYear(date2)
].join("\n&lt;br>"))
});
```
<a href="demo/inspectingDates.html" class="button">View Demo</a>

As you can see, `dojo/date` gives you simple APIs for plumbing information out of a JavaScript Date object.  But what if you need to
perform basic math based on dates?

### Date Calculations

Doing date arithmetic such as calculating "yesterday", or "this time next year" or "three weeks ago"
can all be accomplished simply with `dojo/date.add`:

```js
// start with an arbitrary date:
var testDate = new Date("Wed May 11 2011 03:40:18 GMT+0100 (BST)");

// The first param is the reference date - a JavaScript date object
// ...and the 2nd param to indicate units
var lastYear = date.add(testDate, "year", -1);
var nextWeek = date.add(testDate, "week", 1),
```

<a href="demo/addDates.html" class="button">View Demo</a>

### Date Comparisons

The [dojo/date.compare](/api/?qs=1.10/dojo/date#dojo/date/compare) method returns a 1, 0 or -1 when given two dates.
This makes it suitable for sort functions&mdash;as well as checking if two dates represent the same date, time, or both:

```js
// clone our array of dates
var sortEntries = [].concat(entries);

// now sort them
sortEntries.sort(function(a, b){
	return date.compare(a.jsDate, b.jsDate, "time");
});
return sortEntries;
```

<a href="demo/compareDates.html" class="button">View Demo</a>

As you can see in our example, a lot of [@astro_nicole](http://twitter.com/astro_nicole)'s tweets are photos taken from the International
Space Station (at the time we captured them), so we thought it might be nice to sort them by the time of day each tweet was created. At the heart of this
demo is the call to `dojo/date.compare`, in which we reference and compare the '`jsDate`' property of each tweet/entry.

### ...And More

The `dojo/date` module also has `getTimezoneName` and `difference` methods. Find out more in the
[dojo/date API docs](/api/?qs=1.10/dojo/date) and
[`dojo/date` reference docs](/reference-guide/1.10/dojo/date.html).

### Dates &amp; Localization

You can't even begin talking about formatting or parsing dates without bumping right into the different conventions used to represent dates
in different forms across the world. The [internationalization (i18n) and localization (l10n) system](../i18n/) Dojo uses is documented in its own right
and is beyond the scope of this tutorial. To get further into the goodies `dojo/date` offers, though, we have to know just a little about it.

Your browser stores a locale setting which corresponds to the language and regional variant of that language which you have set (or have
defaulted to).  If you are in the U.S, this is `en-us`; for me, it is `en-gb`. There are many other locales representing
different regions and languages, each with its own date &amp; time conventions.

`dojo.js` needs to know which locales you'll be working with before it is loaded.  You can include extra locales (in addition to the locale
picked up from `navigator.language`) so that when you load a module that has locale-specific dependencies, it can load the i18n bundle (data
and message strings) associated with that module for each of the locales.  You can explore these bundles in your dojo directory at
`./dojo/cldr/nls/{locale}/gregorian.js` (as an example).

```js
dojoConfig = {
	extraLocale: ['en-us', 'en-gb', 'fr', 'es']
}
```

or

```html
<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js""
    data-dojo-config="extraLocale:['en-us', 'en-gb', 'fr', 'es']"></script>
```

### Localized Date Parsing

We don't have to look far for a use case&mdash;between the UK and the US there's enough of a discrepancy to create a minefield of error and confusion.
Let's see how `dojo/date/locale` helps us disambiguate when we parse a date:

```js
require(["dojo/date", "dojo/date/locale"],
	function(date, locale){

	demo = {
		parseL10NDates: function() {
			var gbDateStr = "1/5/2011",
				usDateStr = "1/5/2011",
				gbDate = locale.parse(gbDateStr, {
					formatLength:'short', selector:'date', locale:'en-gb'
				}),
				usDate = locale.parse(usDateStr, {
					formatLength:'short', selector:'date', locale:'en-us'
				});

			this.showResult("UK and US parsing of 1/5/2011",
			[
				"en-gb: " + gbDateStr  + ": " + gbDate,
				"en-us: " + usDateStr + ": " + usDate,
			].join("\n"))
	}
```

<a href="demo/l10nDateParsing.html" class="button">View Demo</a>

In the UK (and Australia), 1/5/2011 reads as day/month/year, i.e. 1st May, 2011. In the U.S. the convention is month/day/year, so we get a
completely different date: January 5th, 2011.  The `dojo/date/locale` module supports a number of date formats for
each supported locale.

<!-- protip -->
> Bear in mind that although you may control the date formats you use to store and send your data, you do not control the locale
settings of your users.  Include the reference locale in your `dojoConfig` and/or build profile, and when known, indicate the
locale you want to use whenever parsing date strings to avoid surprises.

### Formatting Dates

Creating string representations of dates is done with `dojo/date/locale.format`. This is (of course) subject to the same localization
concerns as date parsing.  Its use is also similar:

```js
formatL10NDates: function() {
	var mayDay = new Date("May 01, 2011");

	this.showResult("Localized Dates (May Date: 1st May, 2011)", [
		"locale\tshort\t\t\tlong",	// column headers
		"en-gb\t"	// UK localized short and long date formats
			+ locale.format(mayDay, { locale: "en-gb", formatLength: "short" })
			+ "\t\t\t"
			+ locale.format(mayDay, { locale: "en-gb", formatLength: "full" })
			,
		"en-us\t"	// US localized short and long date formats
			+ locale.format(mayDay, { locale: "en-us", formatLength: "short" })
			+ "\t\t"
			+ locale.format(mayDay, { locale: "en-us", formatLength: "full" })
			,
		"es\t"	// Spanish localized short and long date formats
			+ locale.format(mayDay, { locale: "es", formatLength: "short" })
			+ "\t\t"
			+ locale.format(mayDay, { locale: "es", formatLength: "full" })
	].join("\n"))
},
```
<a href="demo/l10nDateFormatting.html" class="button">View Demo</a>

Each bundle enables various formats. Here, we've specified "short" and "full" length. You can also try "long" or "medium" (the default). Finally, you can
pluck out and format just the date part you need by setting the `selector` property to `year`,
`date`, or `time`.

### ISO Dates

For portable, human-meaningful date representation, Dojo implements a subset of the [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601) standard.  The `dojo/date.stamp` module
provides `fromISOString` and `toISOString` methods which let you round-trip dates with all the year/date/time and time-zone
data intact.  The toISOString method supports the same `selector` property to output just the date without time (or vice-versa).

```js
require(["dojo/date/stamp"],
		function(stamp){
var parseResults = {
	"2011-05-13 (ISO Date)": stamp.fromISOString("2011-05-13"),
	"Combined date and time in UTC": stamp.fromISOString("2011-05-13T08:05:00"),
	"Time": stamp.fromISOString("T08:05:00")
};
```

The `dojo/date/stamp.fromISOString` method can parse many (but not all) ISO 8601 date representations.
See the [`dojo/date/stamp` reference docs](/reference-guide/1.10/dojo/date/stamp.html) for more details.

```js
formatResults["April 12, 1961 (first man in space)"]
 	= stamp.toISOString(firstManInSpace);

formatResults[firstTweet.toUTCString()+" (tweet date)"]
	= stamp.toISOString(firstTweet);

formatResults[now.toUTCString()+ " (now) - date only"]
	= stamp.toISOString(now, { selector: "date" });
```
<a href="demo/isoDates.html" class="button">View Demo</a>

### Conclusion

The `dojo/date` modules bring a lot of convenience and utility to date/time handling.  Internationalizing your code requires
awareness of locale-specific date representation conventions.  Having an i18n-ready date module gives you a serious leg up and puts Dojo
in a vanishingly small club of JavaScript libraries that have done this work for you. We'll talk more about i18n and l10n, as well as the
wealth of similar helpers Dojo has, in future tutorials.

### Colophon

*   [Javascript Date documentation](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date)
*   [dojo/date reference guide](/reference-guide/1.10/dojo/date.html)
*   [dojo/date API docs](/api/?qs=1.10/dojo/date)
*   [dojo/date/locale reference guide](/reference-guide/1.10/dojo/date/locale.html)
*   [dojo/date/locale API docs](/api/?qs=1.10/dojo/date/locale)
*   [dojo/date/stamp reference guide](/reference-guide/1.10/dojo/date/stamp.html)
*   [dojo/date/stamp API docs](/api/?qs=1.10/dojo/date/stamp)
*   [dojo/i18n - internationalization reference guide](/reference-guide/1.10/dojo/i18n.html)