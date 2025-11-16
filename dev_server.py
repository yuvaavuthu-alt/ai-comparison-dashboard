from livereload import Server

server = Server()
server.watch('index.html')
server.watch('css/*.css')
server.watch('js/*.js')
server.watch('data/*.json')
server.watch('data/details/*.md')
server.serve(root='.', port=8080, open_url_delay=1)
