$ ->
    evtSrc = new EventSource("io")

    synthesizeLink = (url, index) =>
        linkText = "攻略#{index+1}"
        fileName = linkText+"."+url.split('.').pop()
        href = "#{url}"+"#name=#{linkText}"+'&content-type=image/jpeg'+'&filepath=/sdcard/travel/'
        img = $ "<img>"
        img.attr 'src', url
        img.attr 'width', 260
        link = $ "<a>"
        link.attr 'href', href
        link.attr 'title', "下载"+linkText
        link.attr 'download', fileName
        link.attr 'name', url
        img.appendTo(link)
        $(link).tooltip()
        link

    cleanPosts = (soup) =>
        posts = $("li", soup)
        cleaned = []
        _.each posts, (e, i, l) =>
            img = $(e).find(".pic img")
            console.log img
            link = $ '<a>'
            src = img.attr("src")
            href = src + "#name=#{src}"+'&content-type=image/jpeg'+'&filepath=/sdcard/travel/'
            console.log href
            link.attr 'href', href
            link.attr 'download', src
            link.attr 'title', "下载"
            link.append img
            cleaned.push link
        cleaned

    onMessage = (e) ->
        data = JSON.parse e.data
        if data
            $('#loading').fadeOut()
            $('#message').fadeOut()
            $('#result-list').fadeIn()
            _.each data.ImgList, (element, index, list) =>
                synthesizeLink(element, index).hide().appendTo($('#result-list')).fadeIn()
                @
            cleaned = cleanPosts data.Posts
            _.each cleaned, (element, index, list) =>
                element.hide().appendTo($('#img-list')).fadeIn()
                @
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
