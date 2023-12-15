# Metis data management GUI

<p class="what_is_metis"><dfn>Metis</dfn> is an open scientific framework, materials data organizer, and collaborative online platform for the nanotechnology research. It was designed for the offline physical and online virtual autonomous laboratories dealing with the materials science. Metis is an AI-ready solution, aiming to bring the recent advances of computer science into a rather conservative area of new materials development and quality control. Metis currently focuses on the X-ray powder diffraction and atomistic simulations. Its development was started in 2021 in BASF (Ludwigshafen am Rhein, Germany) by Bernd Hinrichsen and Evgeny Blokhin.</p>

<p align="center"><img src="https://github.com/basf/metis-backend/blob/master/logo.png" width="300" /></p>

**This is the first part of the whole Metis infra: [GUI](https://github.com/basf/metis-gui) &rlarr; [BFF](https://github.com/basf/metis-bff) &rlarr; [backend](https://github.com/basf/metis-backend).**

This is the Svelte GUI for the Metis materials data server, highly modular, permissively licensed, minimalistically designed, based on the open [Svelte-Spectre](https://kit.metis.science) user interface kit. Supports various materials data formats, real-time cloud simulations, real-time collaborations, [Optimade](https://optimade.org) structure searches, content organizing and sharing, and many more. Displays the server events instantly as they occur, thanks to the [SSE](https://en.wikipedia.org/wiki/Server-sent_events) server push technology. The users are recognized via the third-party OAuth services, such as Microsoft, LinkedIn, GitHub, ORCID, MPDS, etc.

|![On-demand cloud simulations](https://github.com/tilde-lab/metis.science/blob/master/src/assets/img/screenshots/cloud-runs.png) | ![Digesting the experiments data](https://github.com/tilde-lab/metis.science/blob/master/src/assets/img/screenshots/all-data.png) |
|:---:|:---:|
|![Retrieving the data from various sources](https://github.com/tilde-lab/metis.science/blob/master/src/assets/img/screenshots/optimade-search.png) | ![Exporting & sharing the data across your lab](https://github.com/tilde-lab/metis.science/blob/master/src/assets/img/screenshots/content-organizer.png) |


# Installation

```sh
git clone https://github.com/basf/metis-gui
cd metis-gui
npm install
```


# Technical details

## Development build

```sh
npm run dev
```

## Production build

```sh
npm run build
```


## Docker Image

**Warning!** Docker support is highly experimental.

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


## Buildtime config

`./app.config.js`


## Runtime config

`./src/config.ts`


## Sources folder layout

`assets` - static files etc.

`components` - low-level modules

`helpers` - auxiliary utils

`layouts` - CSS framework modules

`pages` - concrete content sections, collections of `views`

`services` - different APIs consumption

`stores` - where the data flow comes from

`types` - TS definitions

`views` - high-level (smarter) modules, cf. `components`


# License

Copyright 2021-2023 BASF SE

BSD 3-Clause
