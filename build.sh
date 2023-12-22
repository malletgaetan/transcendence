#!/usr/bin/env bash

set -e

source .env

export FRONTEND_HOST=$(ip addr show dev eno2 | grep "inet 10" | cut -d ' ' -f 6 | cut -d '/' -f 1)
export FRONTEND_URL=http://${FRONTEND_HOST}:8000/
export VITE_42_OAUTH_REDIRECT_URL="${FRONTEND_URL}api/user/authorize/"
export OAUTH_REDIRECT_URL=$VITE_42_OAUTH_REDIRECT_URL
export VITE_BACKEND_API="http://${FRONTEND_HOST}:8000/api"
export VITE_BACKEND_WEBSOCKET="ws://${FRONTEND_HOST}:8000/ws"

if [ -z "${VITE_42_OAUTH_CLIENT_UID}" ]; then
	echo "Missing VITE_42_OAUTH_CLIENT_UID env var"
	exit 1
fi

if [ -z "${VITE_42_OAUTH_REDIRECT_URL}" ]; then
	echo "Missing VITE_42_OAUTH_REDIRECT_URL env var"
	exit 1
fi

docker compose up -d --build

echo "Website is up at http://$FRONTEND_HOST:8000"
