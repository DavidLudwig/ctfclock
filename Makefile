.PHONY: upload build
upload: build
	rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress ${CURDIR}/www/ alum.wpi.edu:~/public_html/ctfclock/

build:
	npm run ionic:build --prod
