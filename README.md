# XRPD data management GUI

# Installation

```sh
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
