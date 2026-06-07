#!/bin/bash
# MysticDraw 认证持久化设置
# 运行一次后，所有对话窗口都能自动使用

echo "=== MysticDraw 认证设置 ==="
echo ""

# GitHub Token
if [ -z "$GITHUB_TOKEN" ]; then
  echo "1. 去 https://github.com/settings/tokens 生成 Personal Access Token"
  echo "   勾选权限: repo, workflow"
  echo ""
  echo "2. 设置环境变量（持久化到 ~/.bashrc）:"
  echo "   export GITHUB_TOKEN='ghp_xxxxxxxx'"
  echo ""
fi

# Vercel Token
if [ -z "$VERCEL_TOKEN" ]; then
  echo "3. 去 https://vercel.com/account/tokens 生成 Token"
  echo ""
  echo "4. 设置环境变量:"
  echo "   export VERCEL_TOKEN='vc_xxxxxxxx'"
  echo ""
fi

echo "5. 将以下行添加到 ~/.bashrc 或 ~/.bash_profile:"
echo ""
echo "   export GITHUB_TOKEN='你的GitHub Token'"
echo "   export VERCEL_TOKEN='你的Vercel Token'"
echo ""
echo "6. 重新加载: source ~/.bashrc"
echo ""
echo "设置完成后，运行 ./scripts/deploy.sh 一键部署"
