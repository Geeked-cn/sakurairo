import { Iro } from "./config/types.mts";
import iro from "./config/iro";
import { useSiteData } from 'vitepress';

const site = useSiteData();
const base = site.base || '/';

// Helper to add base path to relative URLs
const addBase = (path: string): string => {
    if (!path || path.startsWith('http') || path.startsWith('//')) return path;
    return base + path.replace(/^\//, '');
};

// Apply base to all asset paths
const iroWithPath = {
    ...iro,
    favicon: addBase(iro.favicon as string),
    cover: {
        ...iro.cover,
        avatar: addBase(iro.cover.avatar as string),
        background: {
            ...iro.cover.background,
            desktop: addBase(iro.cover.background.desktop as string),
            mobile: addBase(iro.cover.background.mobile as string),
        }
    },
    nav: {
        ...iro.nav,
        icon: addBase(iro.nav.icon as string),
    }
};

export default {
    load() {
        return iroWithPath;
    }
};
