$ ->
    evtSrc = new EventSource("io")

    synthesizeLink = (url, index) =>
        linkText = "攻略#{index+1}"
        fileName = linkText+url.split('.').pop()
        href = "#{url}"+"#name=#{linkText}"+'&content-type=image/jpeg'+'&filepath=/sdcard/travel/'
        link = $ "<a>#{linkText}</a>"
        link.attr 'href', href
        link.attr 'download', fileName
        link.attr 'name', url
        link

    cleanPosts = (soup) =>
        posts = $("li", soup)
        cleaned = []
        _.each posts, (e, i, l) =>
            cleaned.push $(e).find(".pic img")
        cleaned

    onMessage = (e) ->
        $('#loading').fadeOut()
        data = JSON.parse e.data
        if data
            _.each data.ImgList, (element, index, list) =>
                $('#result-list').append synthesizeLink(element, index)
                @
            cleaned = cleanPosts data.Posts
            _.each cleaned, (element, index, list) =>
                $('#result-list').append element
                @

    onOpen = (e) ->
        console.log 'opened'
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
