.PHONY: prod
prod:
        docker build -t bh:latest .
        - docker container stop bh
        - docker container rm bh
        docker run --env-file .env -p 5000:3000 --name bh --restart unless-stopped -d bh:latest
        - docker image prune -f
