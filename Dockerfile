FROM node:22.14-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SITE_URL=https://apexload.org
ARG VITE_ANDROID_URL=
ARG VITE_IOS_URL=
ARG VITE_PREMIUM_URL=
ARG VITE_SUPPORT_URL=mailto:support@apexload.org
ARG VITE_PRIVACY_URL=/privacy
ARG VITE_TERMS_URL=/terms
ARG VITE_TAKEDOWN_ENDPOINT=

ENV VITE_SITE_URL=$VITE_SITE_URL \
    VITE_ANDROID_URL=$VITE_ANDROID_URL \
    VITE_IOS_URL=$VITE_IOS_URL \
    VITE_PREMIUM_URL=$VITE_PREMIUM_URL \
    VITE_SUPPORT_URL=$VITE_SUPPORT_URL \
    VITE_PRIVACY_URL=$VITE_PRIVACY_URL \
    VITE_TERMS_URL=$VITE_TERMS_URL \
    VITE_TAKEDOWN_ENDPOINT=$VITE_TAKEDOWN_ENDPOINT

RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
