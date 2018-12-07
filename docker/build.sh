#!/bin/bash

base_dir="$( cd "$(dirname "$0")" ; pwd -P )"

cd $base_dir/../
#rm -rf $base_dir/../node_modules/*
#npm i || exit $?
#npm run build || exit $?

# cd current dir
cd $base_dir
rm -rf $base_dir/dist
cp -r $base_dir/../dist $base_dir/
cp -r $base_dir/../src/home $base_dir/dist/

docker build -t 47.105.65.19:5000/billing-system-frontend:v1.0 . || exit $?
docker push 47.105.65.19:5000/billing-system-frontend:v1.0 || exit $?
