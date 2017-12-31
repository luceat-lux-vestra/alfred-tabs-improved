'use strict'

const PORT = '3002'

const getTabData = (name, tab) => (
	{
		title: tab.title,
		subtitle: tab.url,
		arg: encodeURI(JSON.stringify({
			appName: name,
			windowId: tab.windowId,
			tabId: tab.id,
			tabIndex: tab.index,
		})),
		icon: {
			path: '/Applications/' + name + '.app' + '/Contents/Resources/' +
			'firefox.icns',
		},
	})

const matches = (item, query) => {
	return item.title.toLowerCase().normalize().includes(query) ||
		item.subtitle.toLowerCase().normalize().includes(query)
}

async function queryTabs (appName, qrStr) {
	try {
		const browserInfo = await browser.runtime.getBrowserInfo()
		const allTabs = await browser.tabs.query({})
		const tabs = await allTabs.map(getTabData.bind(null, appName)).
			filter(tab => matches(tab, qrStr))

		console.log(browserInfo.name)
		console.log('async function!!', appName)
		console.log(JSON.stringify(tabs))

		return JSON.stringify(tabs)
	}
	catch (err) {
		console.error('err!!', err)
	}
}

async function main () {
	const browserInfo = await browser.runtime.getBrowserInfo()

	const _room = browserInfo.name.toLowerCase().concat(browserInfo.buildID)

	const socket = io.connect('http://localhost:' + PORT)

	socket.on('news', function (data) {
		console.log(data)
		socket.emit('my other event', {my: 'data'})

		console.log(socket.id, 'replier joined to room', _room)
		socket.emit('join', _room)
	})

	socket.on('message', data => {
		console.log('replier got message', data.cmd)

		if ('query' === data.cmd) {
			const appName = data.appName
			const qrStr = data.data

			queryTabs(appName, qrStr).then(tabs => {
				socket.emit('message', {
					room: _room,
					cmd: 'result',
					result: tabs,
				})
			})
		} else if ('activate' === data.cmd) {
			const tab = data.data
			browser.tabs.update(tab.tabId, {active: true})
			browser.windows.update(tab.windowId,
				{drawAttention: true, focused: true})
		} else if ('close' === data.cmd) {
			console.log('close tab', data.data.tabId)
			browser.tabs.remove(data.data.tabId)
		}

	})

}

main()
