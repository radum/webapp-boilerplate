import { render } from 'lit-html';
import PostList from './components/post-list';

import * as util from './util';

class App {
	constructor() {
		this.postsListContainer = document.querySelector('.c-posts');
	}

	async init() {
		const PRE_RENDERED = this.postsListContainer.querySelector('.c-posts-list.is-ssr');
		const params = new URL(location.href).searchParams;
		const year = params.get('year') || util.currentYear;
		const includeTweets = params.has('tweets');

		const posts = await this.getPosts(year, includeTweets);

		if (!PRE_RENDERED) {
			this.renderPosts(posts, this.postsListContainer);
		}
	}

	async getPosts(forYear, includeTweets = false) {
		const url = new URL(`/api/v1/posts/${forYear}`, location);
		const thisYearsPosts = await this.fetchPosts(url.href);
		const posts = thisYearsPosts;

		if (includeTweets) {
			const tweets = await this.fetchPosts(`/tweets/ChromiumDev`);

			posts.push(...tweets);
		}

		// Ensure list of rendered posts is unique based on URL.
		return util.uniquePosts(posts);
	}

	async fetchPosts(url, maxResults = null) {
		try {
			url = new URL(url, location);

			if (maxResults) {
				url.searchParams.set('maxresults', maxResults);
			}

			const resp = await fetch(url.href);
			const json = await resp.json();

			if (!resp.ok || json.error) {
				throw new Error(json.error);
			}

			return json;
		} catch (err) {
			throw err;
		}
	}

	renderPosts(posts, container) {
		posts = util.groupBySubmittedDate(util.sortPostsByDate(posts));

		render(PostList(posts), container);
	}
}

export default App;
