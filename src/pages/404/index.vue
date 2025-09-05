<template>
    <div class="overflow-hidden relative w-full h-[100%]">
        <BackGround direction="diagonal" :speed="0.1" :squareSize="40" borderColor="#999" hoverFillColor="#222" />

        <!-- 装饰性几何元素 -->
        <div class="absolute inset-0 pointer-events-none">
            <!-- 左上角装饰 -->
            <div class="absolute top-8 left-8 w-16 h-16 border-2 border-white/20 rotate-45 animate-pulse"></div>
            <div class="absolute top-16 left-24 w-8 h-8 border border-white/10 rotate-12"></div>

            <!-- 右下角装饰 -->
            <div class="absolute bottom-12 right-12 w-20 h-20 border-2 border-white/15 rounded-full animate-pulse"
                style="animation-delay: 1s;"></div>
            <div class="absolute bottom-8 right-32 w-6 h-6 bg-white/10 rotate-45"></div>

            <!-- 中间左侧装饰线 -->
            <div
                class="absolute left-4 top-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent transform -translate-y-1/2">
            </div>

            <!-- 中间右侧装饰线 -->
            <div
                class="absolute right-4 top-1/3 w-px h-24 bg-gradient-to-b from-transparent via-white/15 to-transparent">
            </div>
        </div>

        <div class="relative w-full h-[92vh]">
            <!-- 主要内容区域 -->
            <div class="absolute inset-0 flex items-center justify-center flex-col">
                <!-- 404文字 -->
                <div class="pointer-events-none mb-8">
                    <FuzzyText :text="`404`" :font-size="160" font-weight="900" color="#fff" :enable-hover="true"
                        :base-intensity="0.18" :hover-intensity="0.5" />
                </div>

                <!-- not found文字 -->
                <div class="pointer-events-none mb-12">
                    <FuzzyText :text="`not found`" :font-size="72" font-weight="900" color="#fff" :enable-hover="true"
                        :base-intensity="0.2" :hover-intensity="0.5" />
                </div>

                <!-- 分隔线 -->
                <div class="w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"></div>

                <!-- 提示文字 -->
                <div class="text-white/60 text-lg font-light mb-8 text-center max-w-md">
                    <p class="mb-2">{{ t('404.page_lost') }}</p>
                    <p class="text-sm text-white/40">{{ t('404.page_not_exist') }}</p>
                </div>

                <!-- 操作按钮 -->
                <div class="flex gap-4 pointer-events-auto">
                    <button @click="goHome"
                        class="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-lg transition-all duration-300 backdrop-blur-sm">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                                </path>
                            </svg>
                            {{ t('404.back_home') }}
                        </span>
                    </button>

                    <button @click="goBack"
                        class="px-6 py-3 bg-transparent hover:bg-white/10 border border-white/20 hover:border-white/40 text-white rounded-lg transition-all duration-300">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            {{ t('404.back_prev') }}
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <!-- 底部装饰 -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
            <div class="flex gap-2">
                <div class="w-2 h-2 bg-white/20 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
                <div class="w-2 h-2 bg-white/20 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                <div class="w-2 h-2 bg-white/20 rounded-full animate-bounce" style="animation-delay: 0.4s;"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import FuzzyText from "@/components/404/FuzzyText.vue";
import BackGround from "@/components/404/BackGround.vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const router = useRouter()

// 返回首页
const goHome = () => {
    router.push('/')
}

// 返回上一页
const goBack = () => {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/')
    }
}
</script>
