$ ->
    $('#downloadAll').click ->
        console.log "downloadAll!"
        $('#result-list a').each ->
            $(@).click()

    $('#search-form').submit (e)->
        e.preventDefault()
        searchWord = $('#input').val()
        $.ajax
            data:
                "word": searchWord
            type: 'POST'
            url: "/search/"
            beforeSend: (jqXHR, settings) ->
                $('#results').slideUp()
                $('#message').html('<span class="alert center alert-info">查询中……</span>').fadeIn()
            success: (data, textStatus, jqXHR) =>
                $('#message').fadeOut()
                $('#loading').html('<div class="progress span4 offset4 progress-striped active"><div class="bar" style="width: 40%;"></div></div>').fadeIn()
                $('#results').slideDown()

            error: (jqXHR, textStatus, errorThrown)->
                $('#message').html '<span class="alert center alert-info">查询失败</span>'
        false
    $('div.sample-travel-targets > span').click (e)->
        $("#input").val $(this).text()
        $("#search-form").submit()
