FROM docker.io/library/node:19-alpine as build

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci

COPY . .
RUN npm run build && rm dist/app.zip


FROM docker.io/library/nginx:1.23

ENV NGINX_ENVSUBST_OUTPUT_DIR="/etc/nginx"
ENV NGINX_ENTRYPOINT_QUIET_LOGS="1"
ENV HOST="_"
ENV PORT="80"
ENV FORCE_HTTPS="0"
ENV REAL_IP_HEADER="X-Forwarded-For"
ENV SET_REAL_IP_FROM1="127.0.0.1/32"
ENV SET_REAL_IP_FROM2="127.0.0.1/32"
ENV SET_REAL_IP_FROM3="127.0.0.1/32"
ENV SET_REAL_IP_FROM4="127.0.0.1/32"
ENV SET_REAL_IP_FROM5="127.0.0.1/32"
ENV PROXY_BFF_API_URL="0"
ENV PROXY_BACKEND_API_URL="0"
ENV METIS_RUNTIME_CONFIG="{}"
EXPOSE 80

COPY --from=build /app/dist/ /srv
COPY .docker/docker-entrypoint.d/ /docker-entrypoint.d
COPY .docker/nginx /etc/nginx
