.PHONY: upload_web upload_ionic upload build

upload: build upload_web upload_ionic

upload_web:
	rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress ${CURDIR}/www/ alum.wpi.edu:~/public_html/ctfclock/

upload_ionic:
	ionic upload --nobuild

build:
	npm run ionic:build --prod
