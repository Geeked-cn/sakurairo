import { defineConfigWithTheme } from 'vitepress';
import { ruby } from "@mdit/plugin-ruby";
import iro from './theme/config/iro';
import { statSync } from 'fs';
import { normalizePath } from 'vite';

const rootDir = normalizePath(process.cwd());

export default defineConfigWithTheme({
    base: '/sakurairo/',
    title: iro.title,
    titleTemplate: iro.titleTemplate,
    description: iro.description,
    cleanUrls: true,
    ignoreDeadLinks: true,
    markdown: {
        config: md => {
            md.use(ruby);
        },
        math: true
    },
    lastUpdated: true,
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
    ],
    lang: 'zh',
    transformPageData(pageData) {
        if (pageData.isNotFound) return;

        pageData.lastUpdated = statSync(pageData.filePath).mtimeMs

        const pagePath = normalizePath(pageData.filePath);
        const relativePagePath = pagePath.startsWith(`${rootDir}/`) ? pagePath.slice(rootDir.length + 1) : pagePath;
        const isPost = relativePagePath.startsWith('posts/');

        if (isPost && !('layout' in pageData.frontmatter)) {
            pageData.frontmatter.layout = 'post'
        }

        if (relativePagePath.toLowerCase() == 'readme.md') {
            pageData.title = '自述文件';
            pageData.frontmatter.title = '自述文件';
        }
    },
});
