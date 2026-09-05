<script setup>
import { inject, ref, onMounted, onUnmounted, watch } from 'vue';
import CoverSocialButton from './CoverSocialButton.vue';

import { data as iro } from '../../iro.data';

const iroDark = inject('iroDark');

const iroBgPageId = ref(0);
const iroBgLoading = ref(false);
const iroBgSwitchToken = ref(0);

const iroRandom = iro.cover.background?.random ?? false;

const isMobile = () => {
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    return flag;
}

const iroBgUrlRaw = isMobile() ? iro.cover.background.mobile : iro.cover.background.desktop;
const appendCacheKey = (url, key) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${key}`;
};

const getIroBgUrl = pageId => iroRandom ? appendCacheKey(iroBgUrlRaw, pageId) : iroBgUrlRaw;
const iroBgUrl = ref(getIroBgUrl(iroBgPageId.value));

const toCssUrl = url => `url("${String(url).replace(/"/g, '\\"')}")`;
const syncLayoutBg = url => {
    document.documentElement.style.setProperty('--iro-site-background-image', toCssUrl(url));
};

const preloadImage = url => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(url);
    image.onerror = reject;
    image.src = url;
});

const switchIroBg = async(step) => {
    if (!iroRandom) return;

    const nextPageId = iroBgPageId.value + step;
    const nextUrl = getIroBgUrl(nextPageId);
    const token = ++iroBgSwitchToken.value;

    iroBgLoading.value = true;
    try {
        await preloadImage(nextUrl);
        if (token != iroBgSwitchToken.value) return;

        iroBgPageId.value = nextPageId;
        iroBgUrl.value = nextUrl;
    }
    catch {}
    finally {
        if (token == iroBgSwitchToken.value) {
            iroBgLoading.value = false;
        }
    }
};

const signatureText = (iro.cover.signature ?? '').trim();
const signatureDisplay = ref('');
const signatureNoise = ref([]);
const signatureApi = iro.cover.signatureApi ?? 'https://api.imsuk.cn/api/Hitokoto';
const signatureColors = [
    'rgb(110,64,170)',
    'rgb(150,61,179)',
    'rgb(191,60,175)',
    'rgb(228,65,157)',
    'rgb(254,75,131)',
    'rgb(255,94,99)',
    'rgb(255,120,71)',
    'rgb(251,150,51)',
    'rgb(226,183,47)',
    'rgb(198,214,60)',
    'rgb(175,240,91)',
    'rgb(127,246,88)',
    'rgb(82,246,103)',
    'rgb(48,239,130)',
    'rgb(29,223,163)',
    'rgb(26,199,194)',
    'rgb(35,171,216)',
    'rgb(54,140,225)',
    'rgb(76,110,219)',
    'rgb(96,84,200)',
];
let signatureTimer = null;

const clearSignatureTimer = () => {
    if (signatureTimer) {
        clearTimeout(signatureTimer);
        signatureTimer = null;
    }
};

const randomNoiseChar = () => String.fromCharCode(94 * Math.random() + 33);
const randomNoise = count => Array.from({ length: count }, () => ({
    char: randomNoiseChar(),
    color: signatureColors[Math.floor(Math.random() * signatureColors.length)],
}));

const getRandomSignatureList = payload => {
    const source = Array.isArray(payload?.data) ? payload.data : payload;
    if (Array.isArray(source)) {
        return source
            .map(item => typeof item == 'string' ? item : item?.text)
            .filter(Boolean);
    }

    return [payload?.text, payload?.hitokoto, typeof payload == 'string' ? payload : '']
        .filter(Boolean);
};

const startSignatureTyping = (sentences, withNoise, onListDone) => {
    clearSignatureTimer();

    const list = sentences.map(item => String(item).trim()).filter(Boolean);
    if (!list.length) {
        signatureDisplay.value = iro.description;
        signatureNoise.value = [];
        return;
    }

    let listIndex = 0;
    let charIndex = 0;
    let direction = 'forward';

    const tick = () => {
        const text = list[listIndex];
        signatureDisplay.value = text.slice(0, charIndex);
        signatureNoise.value = withNoise && direction == 'forward' && charIndex < text.length
            ? randomNoise(Math.min(5, text.length - charIndex))
            : [];

        if (direction == 'forward') {
            if (charIndex < text.length) {
                charIndex++;
                signatureTimer = setTimeout(tick, 75);
                return;
            }

            direction = 'backward';
            signatureTimer = setTimeout(tick, withNoise ? 900 : 1400);
            return;
        }

        if (charIndex > 0) {
            charIndex--;
            signatureTimer = setTimeout(tick, withNoise ? 75 : 45);
            return;
        }

        if (onListDone && listIndex == list.length - 1) {
            signatureTimer = setTimeout(onListDone, 180);
            return;
        }

        listIndex = (listIndex + 1) % list.length;
        direction = 'forward';
        signatureTimer = setTimeout(tick, 180);
    };

    tick();
};

const startRandomSignature = async() => {
    try {
        const response = await fetch(signatureApi);
        const responseText = await response.text();
        let payload = responseText;
        try {
            payload = JSON.parse(responseText);
        }
        catch {}
        startSignatureTyping(getRandomSignatureList(payload), false, startRandomSignature);
    }
    catch {
        startSignatureTyping([iro.description], false);
    }
};

onMounted(() => {
    syncLayoutBg(iroBgUrl.value);

    if (signatureText) {
        startSignatureTyping([signatureText], true);
        return;
    }

    startRandomSignature();
});

watch(iroBgUrl, syncLayoutBg);

onUnmounted(() => {
    clearSignatureTimer();
});
</script>

<template>
    <div class="iro-header-top iro-root" :class="{ 'iro-light': !iroDark, 'iro-dark': iroDark }">
        <figure class="iro-center-bg">
            <div class="iro-focus-info">
                <div class="iro-favicon">
                    <a href="/">
                        <img alt="avatar" loading="lazy" :src="iro.cover.avatar">
                    </a>
                </div>
                <div class="iro-signature">
                    <slot name="iro-signature">
                        <p id="typedWord" class="iro-signature-text">
                            <span>{{ signatureDisplay }}</span>
                            <span v-for="(item, index) in signatureNoise" :key="index" :style="{ color: item.color }">
                                {{ item.char }}
                            </span>
                        </p>
                    </slot>
                </div>

                <div class="iro-social">
                    <CoverSocialButton v-if="iroRandom" iro-icon-name="custom"
                        iro-icon-url="https://s.nmxc.ltd/sakurairo_vision/@2.6/display_icon/sakura/pre.png"
                        @click="switchIroBg(-1)" alt="上一篇">
                    </CoverSocialButton>

                    <CoverSocialButton v-if="iro.social?.links" v-for="link in iro.social.links"
                        :iro-icon-name="link.icon" :iro-icon-url="link?.iconUrl" :iro-link="link.link" :alt="link.name">
                    </CoverSocialButton>

                    <CoverSocialButton v-if="iroRandom" iro-icon-name="custom"
                        iro-icon-url="https://s.nmxc.ltd/sakurairo_vision/@2.6/display_icon/sakura/next.png"
                        @click="switchIroBg(1)" alt="下一篇">
                    </CoverSocialButton>
                </div>
            </div>
        </figure>
    </div>
</template>

<style scoped lang="scss">
.iro-root {
    &.iro-light {
        --iro-var-1: var(--iro-theme-skin, #505050);
        --iro-var-2: rgba(255, 255, 255, 0.6);
    }

    &.iro-dark {
        --iro-var-1: #CCCCCC;
        --iro-var-2: rgba(51, 51, 51, 0.8);
    }
}

.iro-header-top {
    border-radius: 0;
    animation: blur .8s;
    position: relative;
    overflow: hidden;
    height: auto;
    transition: all 0.8s ease !important;

    .iro-center-bg {
        margin: 0;
        padding: 0;
        background: transparent;
        display: block;
        height: 100vh;

        .iro-focus-info {
            position: relative;
            max-width: 800px;
            padding: 0 10px;
            top: 49.3%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 5;
            transition: .4s ease all;

            .iro-favicon {
                display: grid;
                justify-items: center;
                justify-content: center;
                margin: 0;
                max-height: 130px;

                img {
                    width: 130px;
                    height: 130px;
                    position: relative;
                    padding: 5px;
                    opacity: 1;
                    transform: rotate(0);
                    transition: all 0.8s ease !important;
                    border-radius: 100px;
                    animation: iro-fade-in-down 2s;

                    &:hover {
                        transform: rotate(360deg);
                    }
                }

            }

            .iro-signature {
                width: 65%;
                margin: auto;
                font-size: 16px;
                color: var(--iro-var-1);
                background: var(--iro-var-2);
                padding: 15px;
                margin-top: 22px;
                letter-spacing: 0;
                line-height: 30px;
                border-radius: 15px;
                border: 1px solid var(--iro-var-2);
                box-sizing: initial;
                white-space: nowrap;
                font-weight: var(--global-font-weight);
                backdrop-filter: blur(10px);
                transition: all 0.8s ease !important;
                animation: iro-fade-in-down 2s;

                p {
                    display: block;
                    font-size: 16px;
                    min-height: 30px;
                    line-height: 30px;
                    animation: iro-fade-in-down 2s;
                    margin: 0;
                    font-family: 'Noto Serif SC';
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    transition: all 0.8s ease !important;

                    &:hover {
                        color: var(--iro-theme-skin-matching, #505050);
                    }
                }
            }

            .iro-social {
                height: 30px;
                margin-top: 28px;
                list-style: none;
                display: inline-block;

                :deep(li) {
                    float: left;
                    margin: 0px 5px;
                }

                :deep(img) {
                    border-radius: 15px;
                    height: 36px;
                    width: 40px;
                    padding: 8px 10px;
                    border: 0.5px solid var(--iro-var-2);
                    background: var(--iro-var-2);
                    transition: all 0.8s ease !important;
                    animation: iro-fade-in-down 2s;
                }
            }
        }
    }
}
</style>
