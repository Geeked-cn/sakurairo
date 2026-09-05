import { Iro } from "./types.mts";

/**
 * 个人主页配置入口。
 *
 * 常用开关：
 * - home.showPostList：是否在首页封面下显示文章列表
 * - home.showContent：是否显示 index.md 里封面之后的内容
 * - features.cherryBlossom：是否开启樱花飘落动画
 * - features.cursor：鼠标指针样式，cat / dot / system
 */
const randomWallpaperApi = 'https://api.imsuk.cn/api/RandomImg';
const randomSignatureApi = 'https://api.imsuk.cn/api/Hitokoto';

export default {
    title: "天命之子",
    titleTemplate: "Suk",
    description: "Suk的个人主页",
    favicon: '/sakurairo/res/favicon.png',
    home: {
        showContent: false,
        showPostList: false,
        postListTitle: '文章',
    },
    features: {
        cherryBlossom: true,
        cursor: 'dot',
    },
    cover: {
        avatar: '/sakurairo/res/avatar.png',
        signature: '',
        signatureApi: randomSignatureApi,
        background: {
            random: true,
            desktop: randomWallpaperApi,
            mobile: randomWallpaperApi,
        }
    },
    nav: {
        icon: '/sakurairo/res/icon.png',
        links: [
            { title: '博客', url: 'https://longten.dpdns.org', target: '_blank' },
        ]
    },
    search: {
        path: '/',
        param: 's',
    },
    social: {
        iconUrl: 'https://s.nmxc.ltd/sakurairo_vision/@3.0/display_icon/',
        iconPkg: 'fluent_design',
        links: [
            {
                icon: 'wechat',
                link: 'https://pay.imsuk.eu.org/contact',
                name: 'Weixin'
            },
            {
                icon: 'github',
                link: 'https://github.com/Geeked-cn',
                name: 'GitHub'
            },
            {
                icon: 'bilibili',
                link: 'https://space.bilibili.com/3537109885389592?spm_id_from=333.1007.0.0',
                name: 'Bilibili'
            },
            {
                icon: 'dy',
                link: 'https://www.douyin.com/user/MS4wLjABAAAAx2NtxCxp3eSxmZ4__vHHVUe5Niot1CXJdNlIuNiIIz6YhgE90VnWRP3ehD0Bhe3l',
                name: 'Douyin'
            },
            {
                icon: 'tw',
                link: 'https://x.com/xho1738241',
                name: 'X'
            },
            {
                icon: 'zhihu',
                link: 'https://www.zhihu.com/people/lldenchin',
                name: 'Zhihu'
            },
            {
                icon: 'tg',
                link: 'https://t.me/lkhdad',
                name: 'telegram'
            },
            {
                icon: 'mail',
                link: 'mailto:1586841885@qq.com',
                name: 'E-mail'
            },
        ]
    },
    footer: {
        enabled: true,
        content: 'Copyright © by Suk and Fuukei All Rights Reserved.',
        stats: 'Have a good time',
        beforeSlot: false,
        showSakuraIcon: true,
        themeText: 'Sakurairo',
        themeUrl: 'https://github.com/Suk-ldev/me_index',
        authorText: 'Suk Fuukei',
        authorUrl: 'https://longten.dpdns.org',
    },
    style: {
        themeSkin: '#8e78c6',
        themeSkinMatching: '#5892eb',
        themeSkinDark: '#211a39',

        menuRadius: '10px',
        menuSelectionRadius: '10px',
    },
    posts: []
} satisfies Iro.Config;
