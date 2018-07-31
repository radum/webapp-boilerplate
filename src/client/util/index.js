/**
 * Unique items based on url property.
 * @param {!Array} items
 * @param {string} propName Property name to filter on.
 * @return {!Array} unique array of items
 */
function uniqueByProperty(items, propName) {
	const posts = Array.from(
		items
			.reduce((map, item) => {
				return map.set(item[propName], item);
			}, new Map())
			.values()
	);

	return posts;
}

function uniquePosts(items) {
	items = uniqueByProperty(items, 'url');

	return uniqueByProperty(items, 'title');
}

function formatDate(dateStr, monthFormat = 'short') {
	try {
		const date = new Date(dateStr);

		return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: monthFormat, day: 'numeric' }).format(date);
	} catch (err) {
		console.error(dateStr, err);
	}
}

function sortPostsByDate(items) {
	return items
		.sort((a, b) => {
			a = String(a.submitted);
			b = String(b.submitted);
			if (a < b) {
				return -1;
			}
			if (a > b) {
				return 1;
			}
			return 0;
		})
		.reverse();
}

function groupBySubmittedDate (items) {
	const map = new Map();
	items.forEach(item => {
		const submitted = formatDate(item.submitted);
		if (!map.has(submitted)) {
			map.set(submitted, []);
		}
		map.get(submitted).push(item);
	});
	return Array.from(map.entries());
}

export const currentYear = String(new Date().getFullYear());

export { uniquePosts, formatDate, sortPostsByDate, groupBySubmittedDate };
