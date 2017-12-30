'use strict'

// define constants
const SUPPORTED_BROWSERS = [
	'Safari',
	'Safari Technology Preview',
	'Google Chrome',
	'Google Chrome Canary',
	'Chromium',
	'Vivaldi',
	'Yandex',
]

const SAFARI = [
	'Safari',
	'Safari Technology Preview',
]

const CHROMIUM = [
	'Google Chrome',
	'Google Chrome Canary',
	'Chromium',
	'Vivaldi',
	'Yandex',
]

const prefix = '/Applications/'

const getAppPath = appName => {
	return prefix + appName + '.app'
}

const getIconName = name => {
	if (name === 'Safari')
		return 'compass.icns'
	else if (name === 'Safari Technology Preview')
		return 'technology-preview-compass.icns'
	else
		return 'app.icns'
}

const hasApp = name => {
	try {
		if (Application(getAppPath(name)).running())
			return true
	} catch (err) {
		return false
	}
}

const hasTabs = window => {
	try {
		window.tabs()
		return true
	} catch (err) {
		return false
	}
}

const getAppWindows = app => app.windows().
	filter(window => window.name() && hasTabs(window)).
	map(window => ({
		app,
		window,
	}))

const isTabValid = tab => {
	try {
		return tab.url().length > 0
	} catch (err) {
		return false
	}
}

const getAppWindowTabs = item => item.window.tabs().
	filter(isTabValid).
	map((tab, tabIndex) => ({
		app: item.app,
		window: item.window,
		tab,
		tabIndex: tabIndex + 1,
	}))

const getTabId = tab => {
	try {
		return tab.id()
	} catch (err) {
		return null
	}
}

const getAppWindowTabData = item => ({
	title: item.tab.name(),
	subtitle: item.tab.url(),
	arg: encodeURI(JSON.stringify({
		appName: item.app.name(),
		windowId: item.window.id(),
		tabId: getTabId(item.tab),
		tabIndex: item.tabIndex,
	})),
	icon: {
		path: '/Applications/' + item.app.name() + '.app' +
		'/Contents/Resources/' + getIconName(item.app.name()),
	},
})

const matches = (item, query) => {
	return item.title.toLowerCase().normalize().includes(query) ||
		item.subtitle.toLowerCase().normalize().includes(query)
}

function run (argv) {
	const cmd = argv[0]
	const arg = argv[1]

	if ('query' === cmd) {
		const query = arg.toLowerCase().normalize()
		const tabs = SUPPORTED_BROWSERS.filter(hasApp).
			map(name => Application(getAppPath(name))).
			map(getAppWindows).
			reduce((a, b) => a.concat(b), []).
			map(getAppWindowTabs).
			reduce((a, b) => a.concat(b), []).
			map(getAppWindowTabData).
			filter(item => matches(item, query))

		return JSON.stringify(tabs)
	}
	else if ('activate' === cmd || 'close' === cmd) {
		const item = JSON.parse(decodeURI(arg))
		const app = Application(getAppPath(item.appName))
		const window = app.windows().
			filter(window => window.id() === item.windowId)[0]
		const tab = window.tabs().
			filter(tab => getTabId(tab) ? tab.id() === item.tabId : tab.index() ===
				item.tabIndex)[0]

		console.log('activating', item.appName, item.tabId)
		if (SAFARI.find(t => { return t.includes(item.appName.substr(0, 4)) })) {
			window.currentTab = tab
		}
		else if (CHROMIUM.find(
				t => { return t.includes(item.appName.substr(0, 4)) })) {
			window.activeTabIndex = item.tabIndex
		} else {
			app.activate()
			return undefined
		}

		app.activate()
		if ('close' === cmd) app.close(tab)

		return 0
	}
}
