#!/bin/bash
# EdgeOne Pages 部署脚本
# 使用方法：bash deploy.sh
# 需要先安装 EdgeOne CLI: https://github.com/tencent edgeone 或在 EdgeOne 控制台上传

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$PROJECT_DIR/.vitepress/dist"
SITE_NAME="me-index"  # 在 EdgeOne 控制台创建的站点名称

echo "=== Building ==="
cd "$PROJECT_DIR"
npm run build 2>/dev/null || npx vitepress build

echo ""
echo "=== Build Output ==="
ls -la "$DIST_DIR"
echo "Total size: $(du -sh "$DIST_DIR" | cut -f1)"

echo ""
echo "=== Deploy to EdgeOne Pages ==="
echo "方法 1: 使用 EdgeOne CLI（如果已安装）"
echo "  edgeone pages deploy $DIST_DIR --project $SITE_NAME"
echo ""
echo "方法 2: 在 EdgeOne 控制台上传（推荐）"
echo "  1. 访问 https://edgeone.ai/pages"
echo "  2. 点击「创建站点」"
echo "  3. 选择「上传构建产物」"
echo "  4. 上传 $DIST_DIR 目录下的所有文件"
echo "  5. 站点将自动部署，获得一个 pages.dev 域名"
echo ""
echo "方法 3: 使用 GitHub 自动部署"
echo "  1. 将代码推送到 GitHub"
echo "  2. 在 EdgeOne Pages 中连接此仓库"
echo "  3. 设置构建命令: npx vitepress build"
echo "  4. 设置输出目录: .vitepress/dist"
echo ""
echo "=== Done ==="
