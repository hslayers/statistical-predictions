
rsync-demo:
	rsync -r -a -v -e ssh --progress --delete ./dist/ 10.0.0.120:/srv/statistics-demo/dist/

build-demo:
	npm run build --configuration=production