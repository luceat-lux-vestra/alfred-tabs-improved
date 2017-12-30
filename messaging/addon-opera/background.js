'use strict'

const PORT = '3002'

const getIconName = name => {
	if (name === 'Opera')
		return 'app.icns'
	else if (name === 'Opera Beta')
		return 'app-next.icns'
	else
		return 'app-developer.icns'
}

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
			getIconName(name),
		},
	})

const matches = (item, query) => {
	return item.title.toLowerCase().normalize().includes(query) ||
		item.subtitle.toLowerCase().normalize().includes(query)
}

async function queryTabs (appName, qrStr) {
	try {
		const tabs = await new Promise((resolve, reject) => {
			chrome.tabs.query({}, result => {
				// console.log(result);
				const tabs = result.map(getTabData.bind(null, appName)).
					filter(tab => matches(tab, qrStr))

				// console.log('async function!!', appName);
				// console.log('then chrome query', JSON.stringify(tabs));

				resolve(JSON.stringify(tabs))
			})
		})
		// console.log('queryTabs result', tabs);
		return tabs
	}
	catch (err) {
		console.error('err!!', err)
	}
}

async function main () {
	console.log(navigator.userAgent)
	const _version = /OPR\/([0-9.]+)/.exec(navigator.userAgent)[1]
	const _room = 'opera'.concat(_version)

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
				console.log('then queryTabs', tabs)
				socket.emit('message', {
					room: _room,
					cmd: 'result',
					result: tabs,
				})
			})
		} else if ('activate' === data.cmd) {
			const tab = data.data
			chrome.tabs.update(tab.tabId, {active: true})
			chrome.windows.update(tab.windowId, {drawAttention: true, focused: true})
		} else if ('close' === data.cmd) {
			console.log('close tab', data.data.tabId)
			chrome.tabs.remove(data.data.tabId)
		}
	})

}

main()
