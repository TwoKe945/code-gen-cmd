#!/bin/bash

# 定义变量
LIB_NAME="code-gen-bin"

# 初始化子目录的函数
initialize_directory() {
  local dir_name=$1

  mkdir "$dir_name"
  cd "$dir_name"
  pnpm init # 使用 -y 参数自动确认默认值
  touch index.ts
  sed -i "s/\"main\": \"index.js\"/\"main\": \"index.ts\"/" package.json
  sed -i "s/\"name\": \"\(.*\)\"/\"name\": \"@$LIB_NAME\/\1\"/" package.json
  sed -i 's/"version": "1.0.0"/"version": "0.0.1"/' package.json
  
  if [ "$dir_name" != "core" ]; then
    sed -i '/"version": "0.0.1"/a \  "private": true,' package.json
  else
    sed -i "s/\"name\": \"\(.*\)\"/\"name\": \"$LIB_NAME\"/" package.json
  fi

  cd ..
}

# 创建并初始化子目录
for i in commands; do
  initialize_directory "$i"
done
