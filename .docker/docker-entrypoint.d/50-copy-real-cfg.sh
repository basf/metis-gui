#!/bin/sh

set -e

if [ "${SET_REAL_IP_FROM1}" != "127.0.0.1/32" ]; then
    mv /etc/nginx/realip.conf /etc/nginx/conf.d/00-realip.conf
fi

if [ "${PROXY_BFF_API_URL}" != "0" ]; then
    mv /etc/nginx/bff_location_real.conf /etc/nginx/bff_location.conf
fi

exit 0
