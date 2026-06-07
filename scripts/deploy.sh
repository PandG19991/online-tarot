#!/bin/bash
# MysticDraw 一键部署脚本
# 前提: GITHUB_TOKEN 和 VERCEL_TOKEN 已设置

set -e

REPO_NAME="online-tarot"
GITHUB_USER="${GITHUB_USER:-$(git config user.name)}"

echo "=== MysticDraw 部署 ==="

# 检查 token
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN 未设置。先运行 ./scripts/setup-auth.sh"
  exit 1
fi

if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN 未设置。先运行 ./scripts/setup-auth.sh"
  exit 1
fi

# 检查 GitHub CLI
if ! command -v gh &> /dev/null; then
  echo "📦 安装 GitHub CLI..."
  npm install -g gh
fi

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "📦 安装 Vercel CLI..."
  npm install -g vercel
fi

# GitHub 登录（使用 token）
echo "🔐 GitHub 认证..."
echo "$GITHUB_TOKEN" | gh auth login --with-token

# 创建仓库（如果不存在）
echo "📁 创建 GitHub 仓库..."
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push 2>/dev/null || true

# 推送代码
echo "📤 推送代码..."
git branch -M main
git push -u origin main

# Vercel 部署
echo "🚀 部署到 Vercel..."
vercel --token "$VERCEL_TOKEN" --prod --yes

echo ""
echo "✅ 部署完成！"
echo "📦 GitHub: https://github.com/$GITHUB_USER/$REPO_NAME"
