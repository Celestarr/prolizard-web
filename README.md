# mibu

Primary web ui for myfo - [app.myfolab.com](https://app.myfolab.com/)

## Getting started

- Make sure you have following tools installed:
  - [Docker Engine](https://docs.docker.com/engine/install/) (19.03.0+)
  - [docker-compose](https://docs.docker.com/compose/install/)

- Clone the repo

- Create a _.env_ off the sample file provided:
```bash
cp .env.sample .env
```

- Add an entry to your hosts file (`/etc/hosts`) to mimic cookie domain, like this:
```bash
127.0.0.1       localhost
127.0.0.1       local.myfolab.com  #  <-- this

... other entries
```

- Run the project with docker compose:
```bash
docker-compose up
```

Now head over to [local.myfolab.com:8000](http://local.myfolab.com:8000/) in your browser.
