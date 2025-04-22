#!/bin/sh

ENV_FILE="/etc/app/conf/.env"

# 如果有 volume 挂载，则直接覆盖下面的自动生成逻辑
# 若无挂载，则根据环境变量覆盖或生成 .env 文件

# 1. 如果 .env 不存在，则创建
if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
fi

# 2. 定义支持的变量及默认值（如有默认值）
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

# 覆盖/设置所有支持的参数
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

# 3. 启动服务
nginx -g "daemon off;" &  # Start nginx
/app/main                 # Start the app backend
