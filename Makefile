.PHONY: help release build upload upload_web upload_ionic

help:
	@echo ""
	@echo "Please run ${notdir ${MAKE}} with one of the following options:"
	@echo ""
	@echo "  release, rel - builds for production, then uploads to various places"
	@echo ""
	@echo "  build        - builds for production (with minify, etc.)"
	@echo "  upload       - uploads to various places"
	@echo "  upload_web   - uploads to ctfclock.com"
	@echo "  upload_ionic - uploads for Ionic View use"
	@echo ""

release: build upload
rel: release

build:
	npm run ionic:build --prod

upload: upload_web upload_ionic

upload_web:
	rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress ${CURDIR}/www/ alum.wpi.edu:~/public_html/ctfclock/

upload_ionic:
	ionic upload --nobuild
