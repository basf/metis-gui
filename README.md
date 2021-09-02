XRPD data management GUI
==========

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

to be open-sourced