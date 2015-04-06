---
Category:  Getting Started
...

## Dojo Start

How do I start learning Dojo? Where are the docs? How do I get support and training? Which Dojo version should I use? Why do I need to use a web server? How can I avoid common mistakes? How do I report issues? How do I contribute and get involved? These questions and more are answered with this introductory start tutorial.

### Documentation

The Dojo web site offers 3 primary documentation sections to get started, all created via extensive community contributions and efforts.

#### Tutorials

This [collection of tutorials](/documentation/?ver=1.10) offers a free introduction to dozens of Dojo development topics. The order of the first few tutorials is generally the order we recommend. Beyond that, tutorials are grouped by topic. The tutorial series was primarily created by the team at [SitePen](http://sitepen.com/), in response to the question "How do I start learning Dojo?" You should get started with the [Hello Dojo tutorial](../hello_dojo/), or if you're experienced with Dojo, but new to 1.10, you might start with the [Modern Dojo tutorial](../modern_dojo/). After you're finished with this article, of course.

#### Reference Guide

The [reference guide](/reference-guide/1.109/) is a deep collection of documentation primarily organized by API. Contributions may be made to [improve the reference guide through GitHub](https://github.com/dojo/docs/).

#### API Viewer

This is a full tree of the entire [Dojo API](/api/). It is 100% generated from source code comments and JavaScript source code, using two open source projects: [js-doc-parse](https://github.com/SitePen/js-doc-parse), to parse the source tree, and the [API viewer](https://github.com/wkeese/api-viewer), to deliver a human readable version of the parsed source tree. You can also use these two projects with your own source code to [generate your own custom API viewer](http://www.sitepen.com/blog/2013/01/18/generating-and-viewing-custom-api-docs/).

Some cross-referencing exists between these documentation sections, with further refinements planned for the future. For each of the documentation sections, they are versioned by release. The tutorials and reference guide cover 1.6, 1.7, 1.8, 1.9, and 1.10, while the API viewer goes back to version 1.3. See the end of this document for a list of known documentation system issues, and for information on getting involved to improve our documentation efforts.

#### Training and Support

SitePen offers an excellent series of [Dojo workshops](http://sitepen.com/workshops), as well as [Dojo and JavaScript support](http://sitepen.com/support).

#### Where are the books?

Writing an excellent book takes 1000-2000 hours (the tutorial series on the Dojo site alone has taken more than 1000 hours of effort). The existing print Dojo books were released between Dojo 1.0 and 1.5. Ongoing discussions are occurring to create a new living Dojo book, one that gets updated frequently, and would be available for purchase via PDF or print.

### Which Dojo version?

We recommend using the newest Dojo version possible, but provide ongoing support for older releases as we know it takes significant effort to upgrade application source code.

The Dojo Foundation is currently committed to adding new browser support for versions 1.4 and higher. We will periodically update older versions of Dojo to support new browser releases. We will also fix major bugs and regressions, typically in the most recently released major version. New feature development is typically limited to the version currently being created.

Today, this means that new features are being developed for 1.11, bug fixes are primarily going into 1.10.x, and we are periodically adding browser support for 1.4.x and newer.

Looking at the major features and additions for each release of Dojo may help inform your decision. Be sure to check out the release notes for each major release to provide guidance when upgrading between versions. While we do our very best to make upgrades forwards-compatible, fixing of bugs and the introduction of new features may require some effort when you migrate your code base to a new version of Dojo:

*   1.10: [release notes](/reference-guide/1.10/releasenotes/1.10.html), [announcement](http://dojotoolkit.org/blog/dojo-turns-1-10)
*   1.9: [release notes](/reference-guide/1.10/releasenotes/1.9.html), [announcement](http://dojotoolkit.org/blog/dojo-1-9-released)
*   1.8: [release notes](/reference-guide/1.10/releasenotes/1.8.html), [announcement](http://dojotoolkit.org/blog/dojo-1-8-released)
*   1.7: [release notes](/reference-guide/1.10/releasenotes/1.7.html), [announcement](http://dojotoolkit.org/blog/dojo-1-7-released)
*   1.6: [release notes](/reference-guide/1.10/releasenotes/1.6.html), [announcement](http://dojotoolkit.org/blog/dojo-1-6-released)
*   1.5: [release notes](/reference-guide/1.10/releasenotes/1.5.html), [announcement](http://www.sitepen.com/blog/2010/07/22/dojo-1-5-ready-to-power-your-web-app/)
*   1.4: [release notes](/reference-guide/1.10/releasenotes/1.4.html), [announcement](http://www.sitepen.com/blog/2009/12/10/dojo-1-4-released/)

### Start FAQs

Here are some miscellaneous general FAQs and tips for getting started, that may be useful to know beforehand.

#### Deprecation Warnings

You may occasionally see deprecation warnings when using an older Dojo feature in a newer release of Dojo. Note that these warnings mean that the API or feature you are using will be removed in Dojo 2.0, and there is likely an improved approach to consider.

#### Always use a web server

<p>Run your source code from a web server, not the file system, even if the web server is running on your development machine. The browser's handling of HTTP requests from the local file system are more restrictive than from a web server, even when it's running in the same machine. For consistent results, you should always run Dojo from within any HTTP web server (Apache, nginx, Tomcat, IIS, Jetty, etc.).

#### CDN and protocol-less URLs

<p>You may also load Dojo from a CDN. This is useful for quickly using Dojo, as it doesn't require you to host your own copy of Dojo. You'll notice in many of our tutorials that we show protocol-less URLs, e.g. `<script src="//ajax.googleapis.com/ajax/libs/dojo/1.10/dojo/dojo.js" data-dojo-config="async:true"></script>`. This allows you to use Dojo within http and https applications without adjusting the URL. For more information, check out the [Dojo CDN tutorial](../cdn/).

#### Common mistakes

Chances are high that someone has made the same mistake previously. SitePen has created a nice blog post based on their training workshops, showing [common Dojo bugs and error messages](https://www.sitepen.com/blog/2012/10/31/debugging-dojo-common-error-messages), and how to resolve them.

### Known documentation issues

We have substantially improved our documentation efforts through significant community contributions. That said, we have a few known issues (as well as hundreds of content fixes to make at any given time). Known issues include:

*   pre-AMD vs. AMD syntax. With Dojo 1.7, we moved to the AMD format for requiring and defining source code modules. Some documentation provided for 1.7, 1.8, 1.9, and 1.10 may still use the old syntax. While this syntax is still supported, the documentation is simply out of date in some areas, and we can use more help.
*   1.7 API viewer. The 1.7 version of the API viewer is missing significant sections of content. This has been resolved for 1.8, 1.9, and 1.10, which has a very similar set of APIs to 1.7. If the API viewer page in question is blank or missing details, please check the 1.8, 1.9, or 1.10 version of the same page.
*   No tutorials and reference guide prior to 1.6, no API viewer prior to 1.3. This is simply because we started these efforts with those versions, so older versions do not exist.
*   Tablet and mobile viewing of docs. Our API viewer and examples are primarily targeted towards desktop browser viewing. Please report issues to us, or get involved and help fix them.
*   Internet Explorer demos in reference guide. We have resolved many issues with how Internet Explorer loads our demos within the reference guide. For any remaining issues you find, please report them, as explained below.

### Report issues

*   For documentation errors, please report issues at the link at the bottom of each page. We have fixed a few thousand documentation issues since adding this feature in early 2012. Sometimes the fix is quick, sometimes it takes us months, but we read them all and appreciate constructive feedback on where to improve our documentation.
*   For documentation clarification or subsequent questions, please [register for the dojo-interest mailing list](http://mail.dojotoolkit.org/mailman/listinfo/dojo-interest) and start asking questions there, or feel free to drop in to our IRC channel #dojo on [freenode](http://www.freenode.net/irc_servers.shtml).
*   For bugs or enhancement requests, please [create a Dojo Foundation account](http://my.dojofoundation.org/) and then [file a bug report](http://bugs.dojotoolkit.org/).

### Contribute

Dojo is driven completely by the generous efforts and contributions of our community. To get involved beyond basic feedback, we ask that you [create a Dojo Foundation account](http://my.dojofoundation.org/) and then [sign our online contributor license agreement](http://dojofoundation.org/about/claForm). Be sure to link your bug tracker account with your CLA to simplify our verification process. Once you have your CLA on file, here's how to help:

*   API Viewer. Contribute via GitHub at the [js-doc-parse](https://github.com/SitePen/js-doc-parse) and [API viewer](https://github.com/wkeese/api-viewer) projects.
*   Reference Guide. Contribute via GitHub at the [Dojo docs](https://github.com/dojo/docs/) project.
*   Writing new tutorials. Express your interest via the [dojo-interest mailing list](http://mail.dojotoolkit.org/mailman/listinfo/dojo-interest), contact [Dylan Schiemann](https://twitter.com/dylans) directly, or drop us a line using our [contact form](http://dojofoundation.org/contact).
*   Updating tests from DOH to Intern. See [Dojo Automated Testing Improvements: Updating to Intern](https://www.sitepen.com/blog/2014/02/18/dojo-automated-testing-improvements-updating-to-intern/) for more information.
*   Contributing patches and bug fixes: [file a bug](http://bugs.dojotoolkit.org/) and include a patch. For some packages like [dgrid](http://dgrid.io/), you should do this directly through the GitHub project for the specific package. Dojo 1.x is mirrored via GitHub, and will be our primary home for Dojo 2.0.
*   Visit the Dojo Foundation site to learn more about [getting involved with Dojo](http://dojofoundation.org/about/).

### Start

You should get started with the [Hello Dojo tutorial](../hello_dojo/), or if you're experienced with Dojo, but new to 1.10, you might start with the [Modern Dojo tutorial](../modern_dojo/).