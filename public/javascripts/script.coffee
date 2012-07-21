$ ->
    $('#search-form').submit (e)->
        e.preventDefault()
        $.ajax
            data:
                "word": $('#input').val()
            type: 'POST'
            url: "/search/"
            beforeSend: (jqXHR, settings) ->
                $('#message').html('<span class="alert center alert-info">查询中……</span>').slideDown()
            success: (data, textStatus, jqXHR) ->
                $('#message').slideUp()
                $('#result-list').empty()
                $('#results').slideDown()
                $.each data.ImgList, (index, value)->
                    link = $ "<a>#{value}</a>"
                    link.attr 'href', "#{value}"+'#name=tupian'+'&download=tupian.jpeg'+'&content-type=image/jpeg'+'&filename=tupian2.jpeg'
                    link.attr 'id', "#{index}"
                    $('#result-list').append link
            error: (jqXHR, textStatus, errorThrown)->
                $('#message').html '<span class="alert center alert-info">查询失败</span>'
        false