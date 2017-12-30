#!/usr/bin/env node

'use strict'

// =============================================================================

const cp = require('child_process')

const {DEBUG, PRODUCTS, BROWSERS} = require('../common/constants')
const common = require('../lib/common')
const client = require('./socket-client')

const runJxa = require('run-jxa')

function isRunning (name) {
	try {
		const appPath = common.getAppPath(name)
		return runJxa.sync((appPath) => {
			return Application(appPath).running()
		}, [appPath])
	} catch (err) {
		return false
	}
}

class Worker {
	constructor (name) {
		this._prod = name
		this._rc = undefined
		this._handler = undefined
		this._buildID = undefined
		this._tabs = undefined

		if (DEBUG) console.log(this._rc, 'Worker constructed!')
	}

	set setTabs (data) {
		this._tabs = data
	}

	get getTabs () {
		return this._tabs
	}

	static createWorker (name) {
		if (isRunning(name)) {
			let t = new Worker(name)

			t._prod = PRODUCTS.find(t => { return t.includes(name.substr(0, 4)) })
			if (undefined === t._prod) return undefined
			t._rc = name
			t._handler = require('../lib/handler')(t._prod)
			t._buildID = t._handler.getBuildID(name)

			return t
		}
		else return undefined
	}

	queryTabs (qrStr) {
		if (false === isRunning(this._rc))
			return null

		const _prod = this._prod
		const _rc = this._rc
		const _room = _prod.toLowerCase().concat(this._buildID)

		this._tabs = client.query(_room, _rc, qrStr).then(value => {
			// console.log(value);
			return value
		})
		return this._tabs
	}
}

function query (workers, qrStr) {
	return Promise.all(
		workers.map(worker => { return worker.queryTabs(qrStr) }),
	).then(values => {
		// console.log(values);
		return values.filter(v => v).reduce((acc, cur) => {
			return acc.concat(cur)
		}, [])
	})
}

function main () {
	if (DEBUG) console.log(process.argv)

	const _cmd = process.argv[2]
	const _arg = process.argv[3]
	const workers = BROWSERS.filter(isRunning).
		map(name => Worker.createWorker(name)).
		filter(v => v)
	if (!workers)
		return undefined

	if ('query' === _cmd) {
		if (DEBUG) console.log('query', _arg)

		const qrStr = (undefined === _arg) ? '' : process.argv[3].toLowerCase().
			normalize()

		let tabs = JSON.parse(
			cp.execFileSync('osascript',
				['-l', 'JavaScript', 'tabs.js', 'query', qrStr]).toString(),
		)

		query(workers, qrStr).then(extTabs => {
			console.log(JSON.stringify({items: tabs.concat(extTabs)}))
		})
	}
	else if ('activate' === _cmd || 'close' === _cmd) {
		if (!_arg) return undefined

		const _tab = JSON.parse(decodeURI(_arg))
		if (DEBUG) console.error('activate', _tab)
		if (DEBUG) console.error(_cmd, _tab)

		if (undefined ===
			PRODUCTS.find(t => { return t.includes(_tab.appName.substr(0, 4)) })) {
			console.error('call tabs.js with', _cmd, _tab)
			cp.execFileSync('osascript',
				['-l', 'JavaScript', 'tabs.js', _cmd, _arg])
			return 0
		}

		workers.forEach(worker => {
			if (worker._rc !== _tab.appName) {
				console.error(worker._rc, _tab.appName)
				return undefined
			}
			const _room = worker._prod.toLowerCase().concat(worker._buildID)
			client.afterActions(_room, worker._rc, _cmd, _tab)

			// browser side activation doesn't allow to focus for keyboard input.
			runJxa.sync((appPath, winID) => {
				if (Application(appPath).running())
					Application(appPath).activate(winID)
			}, [common.getAppPath(_tab.appName), _tab.windowId])
		})

	}
	else return undefined
}

main()
