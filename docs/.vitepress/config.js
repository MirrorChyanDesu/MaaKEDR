import {defineConfig} from "vitepress";
import {sideBar} from "vitepress-plugin-sidebar";

export default defineConfig({
    base: "/MaaKEDR/",
    cleanUrls: true,
    ignoreDeadLinks: true,
    themeConfig: {
        logo: "/maakedr-logo_128x128.png",
        socialLinks: [
            {icon: "github", link: "https://github.com/APPLe-DF/MaaKEDR"},
        ],
        footer: {
            message: "AGPL-3.0 License",
            copyright: "Copyright © APPLe-DF",
        },
    },
    locales: {
        "/zh/": {
            lang: "zh-CN",
            title: "MaaKEDR",
            description: "《雪松》小助手 — 基于 MaaFramework 的自动化工具",
            themeConfig: {
                nav: [
                    {text: "首页", link: "/zh/"},
                    {text: "English", link: "/en/"},
                ],
                sidebar: sideBar("docs/zh", {
                    pure: true,
                    collapsible: true,
                    collapsed: false,
                    ignoreMDFiles: ["index"],
                }),
            },
        },
        "/en/": {
            lang: "en-US",
            title: "MaaKEDR",
            description: "Cedar Automation Assistant — Powered by MaaFramework",
            themeConfig: {
                nav: [
                    {text: "Home", link: "/en/"},
                    {text: "简体中文", link: "/zh/"},
                ],
                sidebar: sideBar("docs/en", {
                    pure: true,
                    collapsible: true,
                    collapsed: false,
                    ignoreMDFiles: ["index"],
                }),
            },
        },
    },
});
