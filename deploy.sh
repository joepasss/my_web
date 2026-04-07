#!/bin/sh

PROJECT_DIR=""

print_usage() {
	echo "Usage : $0 -d [project root dir]"
	echo "    -d: project root dir path"
}

while [ $# -gt 0 ]; do
	case "$1" in
	-d)
		PROJECT_DIR="$2"
		shift 2
		;;
	*)
		print_usage
		exit 1
		;;
	esac
done

##### backend #####
BACKEND_ROOT="$PROJECT_DIR/backend"

if [ ! -f "$BACKEND_ROOT/package.json" ]; then
	echo "invalid backend project dir"
	exit 1
fi

cd "$BACKEND_ROOT" || exit

if ! npm install; then
	echo "cannot install npm dependencies"
	exit 1
fi

if [ -d "$BACKEND_ROOT/dist" ]; then
	rm -rf "$BACKEND_ROOT/dist"
fi

if ! npm run build; then
	echo "build failed"
	exit 1
fi

pm2 delete "backend" >/dev/null 2>&1

echo "Starting test run ..."

node --import tsx "$BACKEND_ROOT/dist/index.js" >test_run.log 2>&1 &
TEST_PID=$!

echo "Waiting for server to stabilize (5s)..."
sleep 5

if ps -p "$TEST_PID" >/dev/null; then
	echo "Kill test process & switching to PM2..."

	kill $TEST_PID
	wait $TEST_PID 2>/dev/null

	if pm2 start "$BACKEND_ROOT/dist/index.js" --interpreter node --node-args="--import tsx" --name "backend"; then
		echo "deployed"
		echo "\"pm2 status\""
		echo "\"pm2 logs\""
	else
		echo "pm2 failed"
		exit 1
	fi
else
	echo "test run failed"
	cat test_run.log
	exit 1
fi

##### BACKEND NGINX #####
NGINX_CONF_SOURCE="$BACKEND_ROOT/nginx/nginx.conf"
NGINX_DEST=""

if [ "$(uname)" = "Linux" ]; then
	NGINX_DEST="/etc/nginx/conf.d"
elif [ "$(uname)" = "FreeBSD" ]; then
	NGINX_DEST="/usr/local/etc/nginx/conf.d"
else
	echo "unsupported os"
	exit 1
fi

if [ -f "$BACKEND_ROOT/.env" ]; then
	V_UPLOAD=$(grep UPLOAD_PATH "$BACKEND_ROOT/.env" | cut -d '=' -f2 | tr -d '"')
else
	echo ".env file not found"
	exit 1
fi

if [ ! -d "$V_UPLOAD" ]; then
	mkdir -p "$V_UPLOAD"
fi

sed "s|{{FULL_UPLOAD_PATH}}|$V_UPLOAD|g" "$NGINX_CONF_SOURCE" >"/tmp/backend_nginx.conf"

if [ ! -d "$NGINX_DEST" ]; then
	doas mkdir -p "$NGINX_DEST"
fi

doas install -m 644 "/tmp/backend_nginx.conf" "$NGINX_DEST/backend.conf"
rm "/tmp/backend_nginx.conf"

if ! doas nginx -t; then
	echo "nginx syntax error"
	exit 1
fi

if ! doas nginx -s reload; then
	echo "nginx reload error"
	exit 1
fi

echo "backend nginx deployed"
