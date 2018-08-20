import { html } from 'lit-html';
import { repeat } from 'lit-html/lib/repeat';

import * as util from '../util';

const PostList = (posts) => html`
<ul class="c-posts-list">
	${repeat(posts, (item) => item[1].url, (item, i) => {
		const date = item[0];
		const posts = item[1];

		const postTmplResults = repeat(posts, (post) => item.url, (post, i) => {
			post.domain = new URL(post.url).host;

			if (post.author) {
				post.author = post.author.trim();
			}

			const by = post.author ? `by ${post.author}` : '';

			return html`
				<li>
					<a class="post_child post_title" href="${post.url}" target="_blank">${post.title}</a>
					${post.domain} | ${by}
				</li>
			`;
		});

		return html`
			<li>
				<h3>${util.formatDate(date)}</h3>
				<ol>${postTmplResults}</ol>
			</li>
		`;
	})}
</ul>
`;

export default PostList
