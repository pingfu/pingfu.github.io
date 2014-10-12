---
layout: post
title: "Cross domain communication with Ajax and JsonP"
date: 2014-01-13
categories: Programming Troubleshooting
tags: javascript
---

I recently needed to find a way to display third party RSS content on a domain which wasn't the content originator. The same-origin policy implemented in most browsers makes it awkward to directly consume content from a foreign domain, but the most common options are:

- document.domain property - 
Setting this property to the same value between two different frames or windows instructs the browser to relax the same-origin policy for these windows, but this is mostly considered unreliable except in closed-loop systems, and of course requires the co-operation of both parties, something I did not have.

- JSONP - 
Json, "with padding" enables Javascript to fetch data from another domain, circumventing the same-origin policy which typically prohibits web browsers from making sucessful cross-origin requests. JsonP turns Json from data into dynamic Javascript code, which the `<script>` tag is allowed to load from remote servers, which can be retrieved and then executed. Ideal if the remote host I needed to work with exposed a JsonP version of its RSS data feed, which it didn't.

- Cross-Origin Resource Sharing - 
CORS is a modern alternative to the JsonP pattern which enables cross-domain content sharing by adding new HTTP headers which the browser and server can use to determine whether or not to allow the cross-origin content request. Since I have no control over the far-side RSS content producer, this option won't work for me.

- Cross-document messaging / Web Messaging - 
Web Messaging is an API introduced as part of the HTML5 specification. `window.postMessage` enables the sending of data between two entities on domains which would usually be blocked by same-origin policy. It performs cross-domain AJAX without requiring server side shims. `postMessage` requires a receiver to be wired up using `window.addEventListener('message', function(event) { ... }, false);`. Again, impractical for my purposes where I have no control over the far-side content producer of the RSS document.

<!--excerpt-->

I would prefer to discharge the responsibility of fetching and rendering the content directly to the browser, but the same-origin policy does seems to get in the way. Consider an alternative: create a server-side entity to syndicate the RSS feed, download updates and cache them locally so that server-side page construction could pull the content into response body for each request? A lot of effort that anybody might want to invest to pull scrape  some data.

Depending on what sort of availability levels and use-cases are motivating you, there may of course be a compelling reason to put in the extra effort, but in my this case, keep it simple, stupid won.

As it turns out, Google have solved the problem quite nicely. They have an API shim which can be instructed to consume an RSS document, and return it as Json formatted data, padded into JsonP, perfect for traversing the same-origin policy. Even better the API allows anonymous consumption, so we can delegate the responsiblity of syndicating the feed and loading the data directly to the browser, aleviating complexity of a server-side implementation.

Here is a code snippet which demonstrates the solution, relying on Google's API. I've left the jQuery reference in since it was part of the framework I was working on, but to be clear jQuery is a convenience, not a requirement. The code requests that Google's API consumes the word of the day feed at dictionary.com and pulls out the relevant information from the JsonP document response:

<span id="wotd"></span>

```html
<!DOCTYPE html>
<html>
<head>

	<script src="//code.jquery.com/jquery-1.10.2.min.js"></script>

	<script>

		var apiUrl = "//ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json&callback=?&q=http://dictionary.reference.com/wordoftheday/wotd.rss";

		$.getJSON(apiUrl, function(data)
		{
			var word = data.responseData.feed.entries[0].title.replace(": Dictionary.com Word of the Day","");
			var definition = data.responseData.feed.entries[0].content;

			$("blockquote").html("<h1><em>" + word + "</em></h1>" + "<p>" + definition + "</p>");
		});

	</script>

</head>
<body>

	<blockquote></blockquote>

</body>
</html>
```

<script>

	var apiUrl = "//ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json&callback=?&q=http://dictionary.reference.com/wordoftheday/wotd.rss";

	$.getJSON(apiUrl, function(data)
	{
		var word = data.responseData.feed.entries[0].title.replace(": Dictionary.com Word of the Day","");
		var definition = data.responseData.feed.entries[0].content;

		$("#wotd").html("<strong><em>" + word + "</em></strong> - " + definition);
	});

</script>