import {defineConfig} from "vitepress";
import {sideBar} from "vitepress-plugin-sidebar";

export default defineConfig({
    base: "/MaaKEDR/",
    title: "MaaKEDR",
    description: "《雪松》小助手 — 基于 MaaFramework 的自动化工具",
    cleanUrls: true,
    ignoreDeadLinks: true,
    themeConfig: {
        logo: "/maakedr-logo_128x128.png",
        nav: [
            {text: "首页", link: "/"},
            {text: "简体中文", link: "/zh_cn/develop/"},
            {text: "English", link: "/en_us/develop/"},
        ],
        sidebar: sideBar("docs", {
            pure: true,
            collapsible: true,
            collapsed: false,
            ignoreMDFiles: ["index"],
        }),
        socialLinks: [
            {icon: "github", link: "https://github.com/APPLe-DF/MaaKEDR"},
        ],
        footer: {
            message: "AGPL-3.0 License",
            copyright: "Copyright © APPLe-DF",
        },
    },
});
