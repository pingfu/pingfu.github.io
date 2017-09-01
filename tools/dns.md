---
layout: tools
title: Dns Toolbox
redirect_from: "/tools"
redirect_from: "/dns/"
---


<section id="dns-toolbox">

    <h1>Dns toolbox</h1>

    <p>A simple, public DNS resolver. Either use our name server, or specific your own. The tool supports common query types such as A, NS, CNAME, SOA, PTR, MX, TXT, RP, AXFR, AAAA, ANY, and more in addition to full support for IPv6.</p>

    <div class="formFields">

        <p><input id="question" placeholder="pingfu.net" /> ... dns name, or question.</p>
        <p><input id="nameserver" placeholder=""> ... specify a name server, or leave blank to use ours.</p>

        <select id="queryType" name="queryType">
            <option value="255">ANY</option>
            <option value="1">A</option>
            <option value="2">NS</option>
            <option value="5">CNAME</option>
            <option value="6">SOA</option>
            <option value="12">PTR</option>
            <option value="15">MX</option>
            <option value="16">TXT</option>
            <option value="17">RP</option>
            <option value="28">AAAA</option>
            <option value="33">SRV</option>
            <option value="35">NAPTR</option>
            <option value="37">CERT</option>
            <option value="43">DS</option>
            <option value="44">SSHFP</option>
            <option value="99">SPF</option>
            <option value="252">AXFR</option>
            <option value="251">IXFR</option>
            <option value="0">NULL</option>
        </select>

        <select id="queryClass" name="queryClass">
            <option value="1">IN</option>
            <option value="2">CS</option>
            <option value="3">CH</option>
            <option value="4">HS</option>
            <option value="255">ANY</option>
        </select>

        <button id="resolve" type="button">Resolve</button>

    </div>

</section>







<section id="dns-toolbox-answers">

    <div class="loadingImage"><img src="/img/ajax-loader.gif" /></div>

    <div id="dnsResults">

        <h2>Header</h2>
        <div class="header"></div>

        <h2>Questions</h2>
        <table class="questions"></table>

        <h2>Answers</h2>
        <table class="answers"></table>

        <h2 class="authoritiesHeader">Authorities</h2>
        <table class="authorities"></table>

        <h2 class="additionalsHeader">Additionals</h2>
        <table class="additionals"></table>

    </div>

    <div id="dnsResultsError" class="apiErrorMessage"></div>

</section>






<script type="text/javascript">

    function init()
    {
        $("#dnsResults").hide();
        $("#dnsResultsError").hide();
        $("#dns-toolbox-answers").hide();
        $(".loadingImage").hide();

        var userQuestion = getParameterByName("question");
        var userType = getParameterByName("type");
        var userClass = getParameterByName("class");
        var userServer = getParameterByName("server");

        if (userQuestion != null)
        {
            userQuestion = decodeURIComponent(userQuestion);
            $("#question").val(userQuestion);

            if (userType != null) {
                userType = decodeURIComponent(userType).toUpperCase();
                $("#queryType option").filter(function(index) { return $(this).text() === userType; }).attr('selected', 'selected');
            }

            if (userClass != null) {
                userClass = decodeURIComponent(userClass).toUpperCase();
                $("#queryClass option").filter(function(index) { return $(this).text() === userClass; }).attr('selected', 'selected');
            }

            if (userServer != null) {
                userServer = decodeURIComponent(userServer);
                $("#nameserver").val(userServer);
            }

            resolve(userQuestion, userType, userClass, userServer);
        }
    }

    function resolve(question, recordType, recordClass, server)
    {
        var queryQuestion = question    == null ? "" : 'query='   + encodeURIComponent(question);
        var queryType     = recordType  == null ? "" : '&type='   + encodeURIComponent(recordType);
        var queryClass    = recordClass == null ? "" : '&class='  + encodeURIComponent(recordClass);
        var queryServer   = server      == null ? "" : "&server=" + encodeURIComponent(server);
        var query         = queryQuestion + queryClass + queryType + queryServer;

        $("#dns-toolbox-answers").show();
        $(".loadingImage").show();
        $("#dnsResultsError").hide();

        /* clear outputs */
        $("#dnsResults .header").html('');
        $("#dnsResults .questions").html('');
        $("#dnsResults .answers").html('');
        $("#dnsResults .authorities").html('');
        $("#dnsResults .additionals").html('');

        $.ajax({
            type: 'GET',
            url: '//pingfu-api.azurewebsites.net/2017-08/?method=dig&format=jsonp&callback=?&' + query,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json)
            {
                $(".loadingImage").hide();
                $("#dns-toolbox-answers").show();

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

                    /* HEADER */
                    $("#dnsResults .header")
                        .append($('<p>').text(json.TimeStampString))
                        .append($('<p>').text('pingfu.net queried @' + json.ServerAddress + '#' + json.ServerPortNumber + ' for \'' + question + '\' type ' + translateType(json.Questions[0].QType)))
                        .append($('<p>').text('->>HEADER<<- opcode: ' + json.Header.OpCode + ', status: NoError, id: ' + json.Header.Id))
                        .append($('<p>').text('QUERY: ' + json.Header.QuestionCount + ' ANSWER: ' + json.Header.AnswerCount + ' AUTHORITY: ' + json.Header.NameserverCount + ' ADDITIONAL: ' + json.Header.AdditionalRecordsCount + ' '));

                    /* QUESTIONS */
                    json.Questions.forEach(function(entry) {
                        $("#dnsResults .questions").append((
                            $('<tr>')
                            .append($('<td>').text(entry.QName))
                            .append($('<td>').text(translateClass(entry.QClass)))
                            .append($('<td>').text(translateType(entry.QType)))
                            ));
                    });

                    /* ANSWERS */
                    json.Answers.forEach(function(entry) {
                        $("#dnsResults .answers").append(tabuliseDns(entry));
                    });

                    /* AUTHORITIES */
                    json.Authorities.forEach(function(entry) {
                        $("#dnsResults .authorities").append(tabuliseDns(entry));
                    });
                    if (json.Authorities.length == 0) { $(".authoritiesHeader").hide(); }

                    /* ADDITIONALS */
                    json.Additionals.forEach(function(entry) {
                        $("#dnsResults .additionals").append(tabuliseDns(entry));
                    });
                    if (json.Additionals.length == 0) { $(".additionalsHeader").hide(); }
                }
            },
            error: function(e)
            {
                $(".loadingImage").hide();
                $("#dns-toolbox-answers").show();
                $("#dnsResults").hide();
                $("#dnsResultsError").show();
                $("#dnsResultsError").html(e.message);
            }
        });
    }

    function tabuliseDns(entry)
    {
        var recordType = translateType(entry.Type);

        var col = $('<tr>');
        $.each(entry.Record, function(key, value)
        {
            if (value != null)
            {                
                if (recordType == "CNAME" || recordType == "NS" || recordType == "SOA")
                {
                    if (typeof value == "string" && value.endsWith("."))
                    {
                        col.append($('<td>').append($("<a />", { href : "?question=" + value, class : "cname", text : value })));
                        return;
                    }
                }
                col.append($('<td>').text(value));
            }
        });

        var row = $('<tr>')
            .append($('<td>').text(entry.Name))
            .append($('<td>').text(entry.TTL))
            .append($('<td>').text(translateClass(entry.Class)))
            .append($('<td>').text(recordType))
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

    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    function getParameterByName(name) {
        var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, " "));
    }

    function updateParameterByName(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";

        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }

    $("#resolve").click(function (e) {

        e.preventDefault();
        
        var userQuestion = ($("#question").val() == "") ? "pingfu.net" : $("#question").val();
        var userType = translateType($("#queryType").val());
        var userClass = translateClass($("#queryClass").val());
        var userServer = $("#nameserver").val();

        if (userType == "ANY") userType = null;
        if (userClass === "IN") userClass = null;
        if (userServer == "") userServer = null;

        var queryQuestion = userQuestion == null ? "" : "question=" + encodeURIComponent(userQuestion);
        var queryType     = userType     == null ? "" : "&type="    + encodeURIComponent(userType);
        var queryClass    = userClass    == null ? "" : "&class="   + encodeURIComponent(userClass);
        var queryServer   = userServer   == null ? "" : "&server="  + encodeURIComponent(userServer);

        /* navigate */
        window.location.search = queryQuestion + queryClass + queryType + queryServer;
    });

    init();

</script>

