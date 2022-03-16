// used to parse filters in get requests

function filterData(data, filters) {
	const filteredData = data.filter((user) => {
		let isValid = true;
		for (key in filters) {
			console.log(key, user[key], filters[key]);
			isValid = isValid && user[key] == filters[key];
		}
		return isValid;
	});
	return filteredData;
}

module.exports = filterData;
