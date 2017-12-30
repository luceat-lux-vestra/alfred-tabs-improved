module.exports = {
	getBuildID: getBuildID,
}

const fs = require('fs'),
	ini = require('ini'),
	common = require('./common')

const suffix = '/Contents/Resources/application.ini'

const getConfigFilePath = appName => {
	return common.getAppPath(appName) + suffix
}

function getBuildID (appName) {
	const config = ini.parse(fs.readFileSync(getConfigFilePath(appName), 'utf-8'))

	// console.log(config.App.BuildID);
	return config.App.BuildID
}

// getBuildID('FirefoxNightly');
