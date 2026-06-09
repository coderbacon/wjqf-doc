import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "庆丰文档",
	description: "这里有你想要的一切",
	srcDir: "./docs",

	// ==================== 国际化配置 ====================
	locales: {
		root: {
			label: "中文",
			lang: "zh-CN",
			title: "庆丰文档",
			description: "这里有你想要的一切",
			themeConfig: {
				siteTitle: "庆丰文档",
				logo: {
					light: "/logo-black.png",
					dark: "/logo-white.png",
				},
				nav: [
					{ text: "首页", link: "/" },
				],
				sidebar: [
					{
						text: "简介",
						collapsed: true,
						items: [
							{ text: "庆丰文档是什么？", link: "/about/" },
						],
					},
					{
						text: "共享服务器",
						collapsed: true,
						items: [
							{ text: "群晖 NAS", link: "/synology/" },
						],
					},
					{
						text: "金蝶系统",
						collapsed: true,
						items: [
							{ text: "注意", link: "/kingdee/notice/" },
							{ text: "操作手册", link: "/kingdee/manuals/" },
						],
					},
					{
						text: "厂家系统",
						collapsed: true,
						items: [
							{ text: "简介", link: "/factory/" },
							{ text: "DMS系统", link: "/factory/dms.md" },
						],
					},
					{
						text: "道闸系统",
						collapsed: true,
						items: [
							{ text: "使用说明", link: "/gate/" },
						],
					},
				],
				// 中文页面元信息

				outline: {
					label: "页面导航",
				},
				lastUpdated: {
					text: "最后更新于",
				},
				editLink: undefined,
				notFound: {
					title: "页面未找到",
					quote: "您访问的页面不存在，或者该文档已删除。",
					linkText: "返回首页",
				},
				darkModeSwitchLabel: "深色模式",
				sidebarMenuLabel: "菜单",
				returnToTopLabel: "回到顶部",
			},
		},
		en: {
			label: "English",
			lang: "en-US",
			title: "WjqfDoc",
			description: "Wujiang Qingfeng Online Documentation",
			link: "/en/",
			themeConfig: {
				siteTitle: "WjqfDoc",
				logo: {
					light: "/logo-black.png",
					dark: "/logo-white.png",
				},
				nav: [
					{ text: "Home", link: "/en/" },
				],
				sidebar: [
					{
						text: "About",
						items: [
							{ text: "Overview", link: "/en/about/" },
						],
					},
					{
						text: "Shared Server",
						items: [
							{ text: "Synology NAS", link: "/en/synoloy/" },
						],
					},
					{
						text: "Kingdee System",
						items: [
							{ text: "Notices", link: "/en/kingdee/notice/" },
							{ text: "Manuals", link: "/en/kingdee/manuals/" },
						],
					},
					{
						text: "DMS System",
						items: [
							{ text: "User Guide", link: "/en/dms/" },
						],
					},
				],
				// English page meta
				outline: {
					label: "On this page",
				},
				lastUpdated: {
					text: "Last updated",
				},
				editLink: undefined,
				notFound: {
					title: "Page Not Found",
					quote: "The page you are looking for does not exist.",
					linkText: "Back to Home",
				},
				darkModeSwitchLabel: "Dark mode",
				sidebarMenuLabel: "Menu",
				returnToTopLabel: "Back to top",
			},
		},
	},

	// ==================== 全局主题配置 ====================
	themeConfig: {
		// 本地搜索（minisearch），按 locale key 提供双语 UI
		search: {
			provider: "local",
			options: {
				locales: {
					root: {
						translations: {
							button: { buttonText: "搜索文档", buttonAriaLabel: "搜索文档" },
							modal: {
								noResultsText: "未找到相关结果",
								resetButtonTitle: "清除查询",
								backButtonTitle: "关闭搜索",
								displayDetails: "显示详细结果",
								footer: {
									selectText: "选择",
									navigateText: "切换",
									closeText: "关闭",
								},
							},
						},
					},
				},
			},
		},
	},

	// ==================== Markdown 配置 ====================
	markdown: {
		// 代码行号
		lineNumbers: true,
	},

	// ==================== 其他配置 ====================
	cleanUrls: false,
	lastUpdated: true,
});
