# EdgeOne + Cloudflare 域名绑定指南

## 当前部署状态
- **访问链接**: https://sakurairo-9hsw2yrm.edgeone.dev
- **Project ID**: makers-9wiodsebgqim
- **认领链接**: https://console.tencentcloud.com/edgeone/makers/claim?token=8dd79383e69fcf64e1d9433ea099eb7a

---

## 第一步：认领 EdgeOne 项目

在浏览器打开：
```
https://console.tencentcloud.com/edgeone/makers/claim?token=8dd79383e69fcf64e1d9433ea099eb7a
```
登录腾讯云国际版账号后认领项目。

---

## 第二步：在 EdgeOne 控制台添加自定义域名

1. 进入项目页面
2. 点击「Custom Domain」（自定义域名）
3. 点击「Add Domain」
4. 输入你的 Cloudflare 域名（例如：`longten.dpdns.org`）
5. 点击确认

EdgeOne 会给你一个 **CNAME 地址**，类似：
```
xxx.pages.dev 或 xxx.edgeone.net
```

---

## 第三步：在 Cloudflare 配置 DNS

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择你的域名
3. 进入「DNS」→「Records」
4. 添加一条 **CNAME** 记录：

| 类型 | 名称 | 目标 | TTL | Proxy 状态 |
|------|------|------|-----|-----------|
| CNAME | `@` 或 `www` | `xxx.edgeone.net` (EdgeOne 提供的) | Auto | Proxied (橙色云) |

> ⚠️ 必须开启 Proxy (Proxied)，否则 SSL 证书无法生效

---

## 第四步：验证

1. 等待 DNS 生效（通常几分钟）
2. 访问你的域名确认网站正常显示
3. 在 EdgeOne 控制台检查域名状态是否为「Active」

---

## 完整命令参考

```bash
# 部署到 EdgeOne
cd /run/media/shorin/Data/me_index/me_dex/sakurairo
npx vitepress build
edgeone pages deploy .vitepress/dist --name me-index --site global

# 查看部署信息
edgeone makers list
```
