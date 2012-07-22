$ ->
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

                # 穷游
                $.each data[0].ImgList, (index, value) =>
                    linkText = "穷游#{searchWord}攻略#{index}"
                    fileName = linkText+value.split('.').pop();
                    link = $ "<a>#{linkText}</a>"
                    href = "#{value}"+"#name=#{linkText}"+'&content-type=image/jpeg'+'&filepath=/sdcard/travel/'
                    link.attr 'href', href
                    link.attr 'download', fileName
                    link.attr 'id', index
                    link.attr 'name', value
                    $('#result-list').append link
                # 旅人
                zipLink = $ "<a>旅人#{searchWord}攻略</a>"
                zipLink.attr 'href', data[1].PdfLink
                $('#result-list').append zipLink

                $('#result-list a').wrap '<li></li>'

                $('#results').slideDown()

            error: (jqXHR, textStatus, errorThrown)->
                $('#message').html '<span class="alert center alert-info">查询失败</span>'
        false