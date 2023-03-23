# Metis data management GUI

**This is the first part of the whole Metis infra: [GUI](https://github.com/basf/metis-gui) &rlarr; [BFF](https://github.com/basf/metis-bff) &rlarr; [backend](https://github.com/basf/metis-backend).**

A Svelte GUI for the Metis materials data servers, highly modular, permissively licensed, minimalistically designed, based on the open [Svelte-Spectre](https://kit.metis.science) user interface kit. Supports various materials data formats, real-time cloud simulations, real-time collaborations, [Optimade](https://optimade.org) structure searches, content organizing and sharing, and many more. Displays the server events instantly as they occur, thanks to the [SSE](https://en.wikipedia.org/wiki/Server-sent_events) server push technology. The users are recognized via the third-party OAuth services, such as Microsoft, LinkedIn, GitHub, ORCID, MPDS, etc.

|![On-demand cloud simulations](https://github.com/tilde-lab/metis.science/blob/master/src/assets/img/screenshots/cloud-runs.png) | ![Digesting the experiments data](https://github.com/tilde-lab/metis.science/blob/master/src/assets/img/screenshots/all-data.png) |
|:---:|:---:|
|![Retrieving the data from various sources](https://github.com/tilde-lab/metis.science/blob/master/src/assets/img/screenshots/optimade-search.png) | ![Exporting & sharing the data across your lab](https://github.com/tilde-lab/metis.science/blob/master/src/assets/img/screenshots/content-organizer.png) |

# Installation

```sh
git clone https://github.com/basf/metis-gui
cd metis-gui
npm install
```

# Commands

## Development build

```sh
npm run dev
```

## Production build

```sh
npm run build
```

## Docker Image

The production build is packaged into the [nginx](https://hub.docker.com/_/nginx)
container. Inherits all of the parent image's configuration capabilities.
Additional configuration options:

- `HOST` - sets served hosts (default: `_` - catch all)
- `PORT` - listen port
- `FORCE_HTTPS` - redirects to https if set to `1`
- `REAL_IP_HEADER`, `SET_REAL_IP_FROM1`, ..., `SET_REAL_IP_FROM5` - options for
  [real ip module](https://nginx.org/en/docs/http/ngx_http_realip_module.html)
- `PROXY_BFF_API_URL` - proxy `/api` to `metis-bff` if set
- `RUNTIME_CONFIG` - optional javascript object with runtime config, see `src/config.ts`

### docker compose

Example `compose.yml`:

```yaml
version: "3.9"
services:
  metis-frontend:
    build:
      context: .
    environment:
      PORT: "8080"
      FORCE_HTTPS: "0"
      PROXY_BFF_API_URL: "http://metis-bff:3000"
      METIS_RUNTIME_CONFIG: |
        {
          'API_HOST': location.origin.concat('/api'),
          'IDPS': ['local'],
        }
    ports:
      - "9080:8080"
```

# App buildtime config

`./app.config.js`

# App runtime config

`./src/config.ts`

# Sources file layout

`assets` - static files etc.

`components` - low-level modules

`helpers` - auxiliary utils

`layouts` - CSS framework modules

`pages` - concrete content sections

`services` - API consumption

`stores` - where the data flow comes from

`types` - TS definitions

`views` - high-level (smarter) modules, cf. `components`

# License

Copyright 2021-2022 BASF SE

BSD 3-Clause
