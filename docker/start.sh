#!/bin/sh
nginx -g "daemon off;" &  # Start nginx
/app/main                 # Start the app backend
