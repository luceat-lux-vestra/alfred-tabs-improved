module.exports = function (prod) {
	if (undefined === prod)
		return undefined
	else
		return require('./' + prod.toLowerCase())
}
