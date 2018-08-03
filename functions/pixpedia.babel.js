const scrape = require('scrape-it');

module.exports = async (name) => {
	const url = `https://dic.pixiv.net/a/${encodeURIComponent(name)}`;
	const result = await scrape(url, {
		subscript: 'header .subscript',
		description: '#content_title .summary',
		rawImageUrl: {
			selector: '#main-image .illust img',
			attr: 'src',
		},
	});

	result.data.imageUrl = result.data.rawImageUrl.replace('/c/600x600/', '/c/128x128/').replace('master1200', 'square1200');

	return result.data;
};
