const prefix = '/Applications/'

exports.prefix = prefix
exports.getAppPath = appName => {
	return prefix + appName + '.app'
}
