import {defineConfig} from "vitepress";
import {sideBar} from "vitepress-plugin-sidebar";

export default defineConfig({
    base: "/MaaKEDR/",
    title: "MaaKEDR",
    description: "《雪松》小助手 — 基于 MaaFramework",
    cleanUrls: true,
    themeConfig: {
        logo: false,
        sidebar: sideBar("docs", {
            pure: true,
            collapsible: true,
            collapsed: false,
            ignoreMDFiles: ["index"],
        }),
        nav: [
            {text: "首页", link: "/"},
        ],
        socialLinks: [
            {icon: "github", link: "https://github.com/APPLe-DF/MaaKEDR"},
        ],
    },
});
