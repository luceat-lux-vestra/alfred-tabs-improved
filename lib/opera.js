module.exports = {
	getBuildID: getBuildID,
}

const fs = require('fs'),
	plist = require('plist')

const prefix = '/Applications/'
const suffix = '/Contents/Info.plist'

const getAppPath = appName => {
	return prefix + appName + '.app'
}

const getConfigFilePath = appName => {
	return getAppPath(appName) + suffix
}

function getBuildID (appName) {
	const config = plist.parse(
		fs.readFileSync(getConfigFilePath(appName), 'utf-8'))

	// console.log(config.CFBundleVersion);
	return config.CFBundleVersion
}

// getBuildID('Opera Beta');
