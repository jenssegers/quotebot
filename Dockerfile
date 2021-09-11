FROM node:14-slim AS build

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# -------------------------------------------------------------------

FROM node:14-alpine

WORKDIR /app
COPY --from=build /app /app
RUN npm install --production

EXPOSE 3000
ENV NODE_ENV production
CMD [ "npm", "start" ]
