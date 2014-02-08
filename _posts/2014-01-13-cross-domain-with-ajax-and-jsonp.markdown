---
layout: post
title: "Cross domain requests with Ajax and JsonP"
date: 2014-01-13
categories: Programming Troubleshooting
tags: beagleboard
---

Recently I needed to find a way to display third party RSS content on a domain which wasn't the content originator. The same-origin policy implemented in most browsers makes it awkward to directly consume content from a foreign domain, but the most common options are

- document.domain property
Setting this property to the same value between two different frames or windows instructs the browser to relax the same-origin policy for these windows, but this is mostly considered to be unreliable except in closed-loop systems, and of course requires the co-operation of both parties, something I did not have.

- JSONP
Json, "with padding" enables Javascript to fetch data from another domain, circumventing the same-origin policy which typically prohibits web browsers from making sucessful cross-origin requests. JsonP turns Json from data, into dynamic Javascript code, which the `<script>` tag is allowed to load from remote servers, which can be retrieved and then executed. Ideal if I the remote host I needed to work with exposed a JsonP version of its RSS data feed, which it didn't.

- Cross-Origin Resource Sharing
CORS is a modern alternative to the JsonP pattern which enables cross-domain content sharing by adding new HTTP headers which the browser and server can use to determine whether or not to allow the cross-origin content request. Since I have no control over the far-side RSS content producer, this option won't work for me.

- Cross-document messaging / Web Messaging
Web Messaging is an API introduced as part of the HTML5 specification. `window.postMessage` enables the sending of data between two entities on domains which would usually be blocked by same-origin policy. It performs cross-domain AJAX without requiring server side shims. `postMessage` requires a reciever be wired up using `window.addEventListener('message', function(event) { ... }, false);`. Again, impractical for my purposes where I have no control over the far-side content producer of the RSS document.

Preferably I would discharge the responsibility to the browser to aquire and consume this content directly. The same-origin policy however seems to get in the way, making me consider the alternative - creating a server-side entity to syndicate the RSS feed, download updates and cache them locally so that they could be built into the response body by server-side page contstruction. Certainly, more effort that I wanted invest just to pull data from a remote feed.

Google have solved this problem quite nicely with an API shim that consumes RSS, and returns a JsonP document, perfect for traversing the same-origin policy. Even better the API allows anonymous consumption and we can delegate the responsiblity of syndicating the feed and loading the data directly to the browser, aleviating complexity and dependancy from the server-side implementation.

Here is a code snippet which demonstrates the solution, relying on Google's API. I've left the jQuery reference in since it was part of the framework I was working on, but to be clear jQuery is a convenience, not a requirement. The code requests that Google's API consumes the word of the day feed at dictionary.com and pulls out the relevant information from the JsonP document response: <span id="wotd"></span>

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