#!/bin/sh

ENV_FILE="/etc/app/conf/.env"

# Create the .env file if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
  touch "$ENV_FILE"
fi

# Function to set environment variables
set_env_var() {
  VAR_NAME="$1"
  DEFAULT_VALUE="$2"
  eval "VAL=\${$VAR_NAME}"
  if [ -n "$VAL" ]; then
    if grep -q "^$VAR_NAME=" "$ENV_FILE"; then
      sed -i "s|^$VAR_NAME=.*|$VAR_NAME=$VAL|" "$ENV_FILE"
    else
      echo "$VAR_NAME=$VAL" >> "$ENV_FILE"
    fi
  elif ! grep -q "^$VAR_NAME=" "$ENV_FILE" && [ -n "$DEFAULT_VALUE" ]; then
    echo "$VAR_NAME=$DEFAULT_VALUE" >> "$ENV_FILE"
  fi
}

# Set all supported environment variables
set_env_var AUTH_SECRET "auth-secret"
set_env_var PG_HOST "localhost"
set_env_var PG_USER "postgres"
set_env_var PG_PASSWORD "123456"
set_env_var PG_DBNAME "postgres"
set_env_var PG_PORT "5432"
set_env_var PG_TIMEZONE "Asia/Shanghai"
set_env_var PG_DSN ""

set_env_var RD_HOST "localhost"
set_env_var RD_PORT "6732"
set_env_var RD_USER ""
set_env_var RD_PASSWORD "redis"
set_env_var RD_DB "0"

# Start services
nginx -g "daemon off;" &  # Start nginx
/app/main                 # Start the app backend
tail -f /dev/null         # Keep the container running
