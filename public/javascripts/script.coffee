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
                $('#result-list').empty()

                synthesizeLink = (url, index) =>
                    linkText = "#{searchWord}攻略#{index}"
                    fileName = linkText+url.split('.').pop()
                    href = "#{url}"+"#name=#{linkText}"+'&content-type=image/jpeg'+'&filepath=/sdcard/travel/'
                    link = $ "<a>#{linkText}</a>"
                    link.attr 'href', href
                    link.attr 'download', fileName
                    link.attr 'name', url
                    link

                _.each data, (source, sourceIndex, sourcelist) =>
                    _.each source.ImgList, (element, index, list) =>
                        $('#result-list').append synthesizeLink(element, index)
                        @
                    _.each source.PdfLink, (element, index, list) =>
                        $('#result-list').append synthesizeLink(element, index)
                        @

                $('#result-list a').wrap '<li></li>'
                $('#results').slideDown()

            error: (jqXHR, textStatus, errorThrown)->
                $('#message').html '<span class="alert center alert-info">查询失败</span>'
        false