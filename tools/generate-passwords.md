---
layout: tools
title: Generate Passwords
---

<section id="generate-passwords">

    <h1>Passwords</h1>

    <p>A fresh set of randomly generated complex passwords, of varying length and character composition.</p>

    <div class="password-container">
        <div class="passwords-frame">
            <div id="passwords"></div>
            <button id="loadPasswords" type="button">Generate another set</button>
            <img class="loading" src="/img/ajax-loader.gif" />
        </div>
        <div id="error" class="apiErrorMessage"></div>
    </div>

</section>


<script type="text/javascript">

    function init()
    {
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
                            .append($(document.createElement('span')).addClass('password').html(entry.Value).on('click', function() {
                                var el = $(this);
                                navigator.clipboard.writeText(entry.Value);
                                $('.password').removeClass('last-copied');
                                el.addClass('copied last-copied');
                                setTimeout(function() { el.removeClass('copied'); }, 600);
                            }))
                            .append($(document.createElement('span')).addClass('length').html(entry.Length + ' chars'))
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