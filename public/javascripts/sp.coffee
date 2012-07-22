$ ->
    evtSrc = new EventSource("io")

    synthesizeLink = (url, index) =>
        linkText = "攻略#{index}"
        fileName = linkText+url.split('.').pop()
        href = "#{url}"+"#name=#{linkText}"+'&content-type=image/jpeg'+'&filepath=/sdcard/travel/'
        link = $ "<a>#{linkText}</a>"
        link.attr 'href', href
        link.attr 'download', fileName
        link.attr 'name', url
        link

    onMessage = (e) ->
        console.log e.data
        $('#loading').fadeOut()
        if e.data.ImgList?
            _.each e.data.ImgList, (element, index, list) =>
                $('#result-list').append synthesizeLink(element, index)
                @
            _.each e.data.PdfLink, (element, index, list) =>
                $('#result-list').append synthesizeLink(element, index)
                @
            $('div').addClass('row').html(e.data.Posts).appendTo $('#result-list')

    onOpen = (e) ->
        @

    onError = (e) ->
        statusStr = ""
        switch e.eventPhase
            when 0 then statusStr = "CONNECTING"
            when 1 then statusStr = "OPEN"
            when 2 then statusStr = "CLOSED"
        console.log statusStr

    evtSrc.addEventListener "message", onMessage, false
    evtSrc.addEventListener "open",  onOpen, false
    evtSrc.addEventListener "error", onError, false
