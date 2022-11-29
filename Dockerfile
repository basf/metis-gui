FROM docker.io/library/node:18-alpine as build

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci

COPY . .
RUN npm run build


FROM docker.io/library/nginx:1.23

EXPOSE 80
COPY --from=build /app/dist/ /usr/share/nginx/html
