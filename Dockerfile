FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY npm-shrinkwrap.json ./
COPY examples ./examples
COPY src ./src
COPY libs ./libs
COPY resources ./resources
COPY LICENSE ./LICENSE
COPY docs ./docs
COPY *.js ./
COPY *.sh ./
RUN npm ci
# COPY .env ./
RUN npm run build

FROM nginx:stable-alpine as production-stage

RUN apk add --update bash && rm -rf /var/cache/apk/*

RUN mkdir /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/examples /app/examples
COPY --from=build-stage /app/libs /app/libs
COPY --from=build-stage /app/build /app/build
EXPOSE 80

# COPY entrypoint.sh /app/entrypoint.sh
# ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
