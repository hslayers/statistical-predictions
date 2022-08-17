
rsync-demo:
	rsync -r -a -v -e ssh --delete ../../dist/ 10.0.0.120:/srv/statistics-demo/dist/

build-demo:
	ng build --configuration=production