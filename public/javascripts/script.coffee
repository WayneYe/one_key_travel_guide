$().ready ->
    $('#search-form').submit (e)->
        e.preventDefault()
        $.ajax
            data:
                "word": $('#input').val()
            type: 'POST'
            url: "/search/"
            beforeSend: (jqXHR, settings) ->
                $('#search-result').html '<span class="label label-info">查询中</span>'
            success: (data, textStatus, jqXHR) ->
                $('#search-result').html '<span class="label label-success">查询成功</span>'
            error: (jqXHR, textStatus, errorThrown)->
                $('#search-result').html '<span class="label label-info">查询失败</span>'
        false