
DOCKER = docker
BUILDX = $(DOCKER) buildx
BUILDER_NAME=valmi-docker-builder

.PHONY: build-and-push

setup-buildx:
	$(DOCKER) run --privileged --rm tonistiigi/binfmt --install all
	$(BUILDX) rm $(BUILDER_NAME) || true
	$(BUILDX) create --name $(BUILDER_NAME) --driver docker-container --bootstrap
	$(BUILDX) use $(BUILDER_NAME)

build-and-push:
	$(BUILDX) build --platform linux/amd64,linux/arm64 \
		-t valmiio/valmi-app:${version} \
		-t valmiio/valmi-app:stable \
		-t valmiio/valmi-app:latest \
		--push -f Dockerfile.prod .

