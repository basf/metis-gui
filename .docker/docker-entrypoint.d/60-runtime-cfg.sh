#!/usr/bin/env bash

set -e pipefail

: "${METIS_RUNTIME_CONFIG_SRC:=/srv/index.html}"
: "${METIS_RUNTIME_CONFIG_DEST:=/srv/index.html}"
PREFIX="window._METIS_RUNTIME_CONFIG = "

if [ -n "${METIS_RUNTIME_CONFIG+x}" ]; then
    echo "Injecting runtime config..."
    TMP=$(mktemp)
    cp --attributes-only --preserve "$METIS_RUNTIME_CONFIG_SRC" "$TMP"
    sed -e "s/$PREFIX{}/$PREFIX\${METIS_RUNTIME_CONFIG}/" "$METIS_RUNTIME_CONFIG_SRC" \
        | envsubst \$METIS_RUNTIME_CONFIG > "$TMP"
    mv "$TMP" "$METIS_RUNTIME_CONFIG_DEST"
fi

exit 0
