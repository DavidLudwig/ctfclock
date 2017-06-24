.PHONY: help release build upload upload_web upload_ionic

help:
	@echo ""
	@echo "Please run ${notdir ${MAKE}} with one of the following options:"
	@echo ""
	@echo "  release, rel - builds for production, then uploads to various places"
	@echo ""
	@echo "  build         - builds for production (with minify, etc.)"
	@echo "  upload        - uploads to various places"
	@echo "  upload_google - uploads to cffclock.com (at Google)"
	@echo "  upload_wpi    - uploads to OLD ctfclock.com (at alum.wpi.edu)"
	@echo "  upload_ionic  - uploads for Ionic View use"
	@echo ""

release: build upload
rel: release

build:
	npm run ionic:build --prod

upload: upload_google upload_ionic upload_wpi

upload_wpi:
	rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress ${CURDIR}/www/ alum.wpi.edu:~/public_html/ctfclock/

upload_google:
	gsutil -m rsync -d -r ${CURDIR}/www/ gs://ctfclock.com/

upload_ionic:
	ionic upload --nobuild
