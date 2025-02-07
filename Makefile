.PHONY: prod
prod:
	- docker compose -f compose.yaml down
	docker compose -f compose.yaml up --build --force-recreate -d nextjs minio


dev:
	docker compose -f compose.yaml down
	docker compose -f compose.yaml up -d postgres
	sleep 3
	docker compose -f compose.yaml up --build --force-recreate -d nextjs minio

