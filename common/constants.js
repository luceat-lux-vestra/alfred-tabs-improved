const DEBUG = false

const PORT = '3002'

const PRODUCTS = [
	'Firefox',
	'Opera',
]

const SUPPORTED_BROWSERS = [
	'Safari',
	'Safari Technology Preview',
	'Google Chrome',
	'Google Chrome Canary',
	'Chromium',
	'Vivaldi',
	'Yandex',
]

const BROWSERS = [
	// You can run in parallel different release channel of Firefox using MultiFirefox
	'Firefox',
	'FirefoxBeta',
	'FirefoxDeveloperEdition',
	'FirefoxNightly',

	//  You can use all 3 Opera browsers in parallel
	'Opera',
	'Opera Beta',
	'Opera Developer',
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

exports.DEBUG = DEBUG
exports.PORT = PORT
exports.PRODUCTS = PRODUCTS
exports.BROWSERS = BROWSERS
exports.SUPPORTED_BROWSERS = SUPPORTED_BROWSERS
exports.SAFARI = SAFARI
exports.CHROMIUM = CHROMIUM
