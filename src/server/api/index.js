const express = require('express');

const apiRouter = express.Router();

apiRouter.get('/api/posts/:year?/:month?/:day?', async (req, res) => {
	const posts = [
		{
			title: 'Page Lifecycle API - Philip Walton',
			url: 'https://paul.kinlan.me/page-lifecycle-apiphilip-walton/',
			domain: 'paul.kinlan.me',
			submitted: '2018-07-26T23:10:28.000Z',
			submitter: {
				name: 'RSS bot',
				email: '',
				picture: '/img/rss_icon_24px.svg',
				bot: true
			},
			author: 'paul.kinlan@gmail.com (Paul Kinlan)'
		},
		{
			'title': 'What are the pain points for web designers?',
			'url': 'https://medium.com/dev-channel/what-are-the-pain-points-for-web-designers-4165bd052ba?source=rss----32c64651a75---4',
			'domain': 'medium.com',
			'submitted': '2018-07-30T11:49:37.000Z',
			'submitter':{
				'name': 'RSS bot',
				'email': '',
				'picture': '/img/rss_icon_24px.svg',
				'bot':true
			},
			'author': 'Mustafa Kurtuldu'
		}
	]

	res.status(200).send(posts);
});

module.exports = apiRouter;
