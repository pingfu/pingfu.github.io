function init()
{
	$("#dnsResults").hide();
	$("#dnsResultsError").hide();
	$("#randomPasswords").hide();
	$("#randomPasswordsError").hide();
	$(".loadingImage").hide();
}

function loadPasswords()
{
	$("#randomPasswords").html('');
	$("#randomPasswordsError").html('');			
	$(".loadingImage").show();

	var passwordsUrl = 'http://api.pingfu.net/2014-01/?method=pingfu.cryptography.password.generate&format=jsonp&callback=?';

	$.ajax({
		type: 'GET',
		url: passwordsUrl,
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(json)
		{
			$(".loadingImage").hide();
			
			if (json.Code == 429)
			{
				$("#randomPasswords").hide();
				$("#randomPasswordsError").show();
				$("#randomPasswordsError").html(json.Message);
			}
			else
			{
				$("#randomPasswords").show();

				var ul = $('<ul>');
				json.forEach(function(entry) {
					ul.append($('<li>')
						.append($(document.createElement('span')).addClass('passwordLength').html(' (' + entry.Length + ')'))
						.append($(document.createElement('span')).addClass('password').html(entry.Value)));
				});
				$('#randomPasswords').append(ul);
			}
		},
		error: function(e)
		{
			$(".loadingImage").hide();
			$("#randomPasswordsError").show();
			$("#randomPasswords").html(e.message);
		}
	});
}


function resolveByForm()
{
	var rawQuestion = ($("#question").val() == '') ? 'example.net' : $("#question").val();
	var question    = '&query='  + rawQuestion;
	var nameserver  = '&server=' + $("#nameserver").val();
	var queryClass  = '&class=' 	+ translateClass($("#queryClass").val());
	var queryType   = '&type='  	+ translateType($("#queryType").val());
	var dnsUrl      = 'http://api.pingfu.net/2014-01/?method=pingfu.dns.lookup&format=jsonp&callback=?' + question + queryClass + queryType + nameserver;

	resolve(rawQuestion, question, nameserver, queryClass, queryType, dnsUrl);
}

function resolveByHref()
{
	
}

function resolve(rawQuestion, question, nameserver, queryClass, queryType, dnsUrl)
{
	$(".loadingImage").show();
	$("#dnsResultsError").hide();
	// the script appends to these elements to clear out the last values
	$("#dnsResults .header").html('');
	$("#dnsResults .questions").html('');
	$("#dnsResults .answers").html('');
	$("#dnsResults .authorities").html('');
	$("#dnsResults .additionals").html('');

	$.ajax({
		type: 'GET',
		url: dnsUrl,
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(json)
		{
			$(".loadingImage").hide();

			if (json.Code == 429 || json.Code == 401)
			{
				$("#dnsResults").hide();
				$("#dnsResultsError").show();
				$("#dnsResultsError").html(json.Message);
			}
			else if (json.Error != '')
			{
				$("#dnsResults").hide();
				$("#dnsResultsError").show();
				$("#dnsResultsError").html(json.Error);
			}
			else
			{
				$("#dnsResults").show();
				$(".authoritiesHeader").show();
				$(".additionalsHeader").show();

				// HEADER
				$("#dnsResults .header")
					.append($('<p>').text(json.TimeStampString))
					.append($('<p>').text('pingfu.net queried @' + json.ServerAddress + '#' + json.ServerPortNumber + ' for \'' + rawQuestion + '\' type ' + translateType(json.Questions[0].QType)))
					.append($('<p>').text('->>HEADER<<- opcode: ' + json.Header.OpCode + ', status: NoError, id: ' + json.Header.Id))
					.append($('<p>').text('QUERY: ' + json.Header.QuestionCount + ' ANSWER: ' + json.Header.AnswerCount + ' AUTHORITY: ' + json.Header.NameserverCount + ' ADDITIONAL: ' + json.Header.AdditionalRecordsCount + ' '));

				// QUESTIONS
				json.Questions.forEach(function(entry) {
					$("#dnsResults .questions").append((
						$('<tr>')
						.append($('<td>').text(entry.QName))
						.append($('<td>').text(translateClass(entry.QClass)))
						.append($('<td>').text(translateType(entry.QType)))
						));
				});

				// ANSWERS
				json.Answers.forEach(function(entry) {
					$("#dnsResults .answers").append(tabuliseDns(entry));
				});

				// AUTHORITIES
				json.Authorities.forEach(function(entry) {
					$("#dnsResults .authorities").append(tabuliseDns(entry));
				});
				if (json.Authorities.length == 0) { $(".authoritiesHeader").hide(); }

				// ADDITIONALS
				json.Additionals.forEach(function(entry) {
					$("#dnsResults .additionals").append(tabuliseDns(entry));
				});
				if (json.Additionals.length == 0) { $(".additionalsHeader").hide(); }
			}
		},
		error: function(e)
		{
			$(".loadingImage").hide();
			$("#dnsResults").hide();
			$("#dnsResultsError").show();
			$("#dnsResultsError").html(e.message);
		}
	});
}


function tabuliseDns(entry)
{

	
	var col = $('<tr>');
	$.each(entry.Record, function(k, v) {
		if (v != null)
			col.append($('<td>').text(v));
	});

	var row = $('<tr>')
		.append($('<td>').text(entry.Name))
		.append($('<td>').text(entry.TTL))
		.append($('<td>').text(translateClass(entry.Class)))
		.append($('<td>').text(translateType(entry.Type)))
		.append($('<td>').append($('<table>').addClass("childTable").append(col)));

	return row;
}


function translateType(dnsType)
{
	var typeEnum = 
	{
		'A' : 1,
		'NS' : 2,
		'MD' : 3,
		'MF' : 4,
		'CNAME' : 5,
		'SOA' : 6,
		'MB' : 7,
		'MG' : 8,
		'MR' : 9,
		'NULL' : 10,
		'WKS' : 11,
		'PTR' : 12,
		'HINFO' : 13,
		'MINFO' : 14,
		'MX' : 15,
		'TXT' : 16,
		'RP' : 17,
		'AFSDB' : 18,
		'X25' : 19,
		'ISDN' : 20,
		'RT' : 21,
		'NSAP' : 22,
		'NSAPPTR' : 23,
		'SIG' : 24,
		'KEY' : 25,
		'PX' : 26,
		'GPOS' : 27,
		'AAAA' : 28,
		'LOC' : 29,
		'NXT' : 30,
		'EID' : 31,
		'NIMLOC' : 32,
		'SRV' : 33,
		'ATMA' : 34,
		'NAPTR' : 35,
		'KX' : 36,
		'CERT' : 37,
		'A6' : 38,
		'DNAME' : 39,
		'SINK' : 40,
		'OPT' : 41,
		'APL' : 42,
		'DS' : 43,
		'SSHFP' : 44,
		'IPSECKEY' : 45,
		'RRSIG' : 46,
		'NSEC' : 47,
		'DNSKEY' : 48,
		'DHCID' : 49,
		'NSEC3' : 50,
		'NSEC3PARAM' : 51,
		'HIP' : 55,
		'SPF' : 99,
		'UINFO' : 100,
		'UID' : 101,
		'GID' : 102,
		'UNSPEC' : 103,
		'TKEY' : 249,
		'TSIG' : 250,
		'TA' : 32768,
		'DLV' : 32769,
		'IXFR' : 251,
		'AXFR' : 252,
		'MAILB' : 253,
		'MAILA' : 254,
		'ANY' : 255
	}
	return translateEnum(typeEnum, dnsType);
}


function translateClass(dnsClass)
{
	var classEnum = 
	{
		'IN' : 1,
		'CS' : 2,
		'CH' : 3,
		'HS' : 4,
		'ANY' : 255
	}
	return translateEnum(classEnum, dnsClass);
}


function translateEnum(enumtype, enumvalue)
{
	for (var enumName in enumtype)
	{
		if (enumtype[enumName] == enumvalue)
		{
			return enumName;
		}
	}
}


$("#loadPasswords").click(function (e) {
	e.preventDefault();
	init();
	loadPasswords();
});


$("#resolve").click(function (e) {
	e.preventDefault();
	init();
	resolveByForm();
});


//
//

init();