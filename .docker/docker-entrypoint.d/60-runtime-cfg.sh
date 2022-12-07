#!/bin/sh

set -e

TARGET="/srv/index.html"
PREFIX="window._METIS_RUNTIME_CONFIG = "

if [ -n "${METIS_RUNTIME_CONFIG+x}" ]; then
    echo "Injecting runtime config..."
    TMP=$(mktemp)
    cp --attributes-only --preserve "$TARGET" "$TMP"
    sed -e "s/$PREFIX{}/$PREFIX\${METIS_RUNTIME_CONFIG}/" "$TARGET" \
        | envsubst \$METIS_RUNTIME_CONFIG > "$TMP"
    mv "$TMP" "$TARGET"
fi

exit 0
