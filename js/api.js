function init()
{
    
	$(".hide-hero").click(function() {
		$("#logo").slideUp();
		$(".blog-posts").hide();
	});

	$(".show-hero").click(function() {

		$("#logo").slideDown();
		$(".blog-posts").show();
	});
}

function loadIpInfo()
{
	$.getJSON('//ipinfo.io/json', function(data)
	{
		$(".userip").text(data.ip);

		data['lowerCaseCountry'] = data.country.toLowerCase();
		
		$.get("/templates/ip-info.html", function (template) {
			$("#ip-info").html(Mustache.to_html(template, data));
		});
	});
}

//
//

init();