---
layout: tools
title: Generate Passwords
---

<section id="generate-passwords">

    <h1>Passwords</h1>

    <p>A set of complex passwords, of varying length and character compositions generated randomly just for you.</p>

    <div id="passwords"></div>
    <div id="error" class="apiErrorMessage"></div>
    
    <button id="loadPasswords" type="button">Generate another set &hellip;</button>

    <img class="loading" src="/img/ajax-loader.gif" />

</section>


<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js" integrity="sha384-cV+rhyOuRHc9Ub/91rihWcGmMmCXDeksTtCihMupQHSsi8GIIRDG0ThDc3HGQFJ3" crossorigin="anonymous"></script>

<script type="text/javascript">

    function init()
    {
        new Clipboard('.copyButton');

	    $("#passwords").hide();
	    $("#error").hide();
	    $(".loading").hide();
    }

    function loadPasswords()
    {
        $("#passwords").html('');
        $("#error").html('');			
        $(".loading").show();

        var passwordsUrl = '//pingfu-api.azurewebsites.net/2014-01/?method=pingfu.cryptography.password.generate&format=jsonp&callback=?';

        $.ajax({
            type: 'GET',
            url: passwordsUrl,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json)
            {
                $(".loading").hide();
                
                if (json.Code == 429)
                {
                    $("#passwords").hide();
                    $("#error").show();
                    $("#error").html(json.Message);
                }
                else
                {
                    $("#passwords").show();

                    var ul = $('<ul>');
                    json.forEach(function(entry, i) {
                        ul.append($('<li>')
                            .append($(document.createElement('span')).addClass('length').html(' (' + entry.Length + ')'))
                            .append($(document.createElement('span')).addClass('password password-' + i).html(entry.Value))
                            .append($(document.createElement('button')).text("copy").addClass("copyButton").attr("data-clipboard-action", "copy").attr("data-clipboard-target", ".password-" + i))
                            );
                    });
                    $('#passwords').append(ul);
                }
            },
            error: function(e)
            {
                $(".loading").hide();
                $("#error").show();
                $("#passwords").html(e.message);
            }
        });
    }

    $("#loadPasswords").click(function (e) {
        e.preventDefault();
        init();
        loadPasswords();
    });
    
    init();
    loadPasswords();

</script>