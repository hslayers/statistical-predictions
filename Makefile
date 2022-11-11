
rsync-demo:
	rsync -r -a -v -e ssh --progress --delete ./dist/ 10.0.0.120:/srv/statistics-demo/dist/

build-demo:
	npm run build --configuration=production

start-local-build:
	cd dist && live-server --port=5100 --proxy=/statistical-predictions:http://127.0.0.1:5100 --no-browser --host=localhost && cd ..