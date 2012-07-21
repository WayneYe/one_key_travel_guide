{print} = (require 'util')
{spawn} = (require 'child_process')

task 'watch', 'Watch for changes', ->
    workers = [
        spawn('node', ['node_modules/coffee-script/bin/coffee', '-wc', 'public/javascripts'])
        , spawn('node', ['node_modules/coffee-script/bin/coffee', '-wc', 'content-script/javascripts'])
        , spawn('node', ['node_modules/stylus/bin/stylus', '-w', '-o', 'public/stylesheets', 'public/stylesheets'])
        , spawn('node', ['node_modules/stylus/bin/stylus', '-w', 'content-script/stylesheets', '-o', 'content-script/stylesheets'])
    ]
    for worker in workers
        worker.stderr.on 'data', (data) -> process.stderr.write data.toString()
        worker.stdout.on 'data', (data) -> print data.toString()
