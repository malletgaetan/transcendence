FROM node:lts-alpine as build
ARG VITE_BACKEND_API
ARG VITE_BACKEND_WEBSOCKET
ARG VITE_42_OAUTH_CLIENT_UID
ARG VITE_42_OAUTH_REDIRECT_URL
RUN mkdir /app
COPY ./frontend /app/frontend
WORKDIR /app/frontend
RUN echo VITE_BACKEND_API=$VITE_BACKEND_API >> .env
RUN echo VITE_BACKEND_WEBSOCKET=$VITE_BACKEND_WEBSOCKET >> .env
RUN echo VITE_42_OAUTH_CLIENT_UID=$VITE_42_OAUTH_CLIENT_UID >> .env
RUN echo VITE_42_OAUTH_REDIRECT_URL=$VITE_42_OAUTH_REDIRECT_URL >> .env
RUN npm install
RUN npm run build
FROM nginx:1.25.3
RUN rm -rf /var/www/html
RUN mkdir -p /etc/nginx/ssl
COPY --from=build /app/frontend/dist /var/www/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8000
