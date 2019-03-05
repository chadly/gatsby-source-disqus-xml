import { readFileSync } from "fs";
import xpath from "xpath";
import xdom from "xmldom";

const dom = xdom.DOMParser;

exports.sourceNodes = (
	{ actions: { createNode }, createNodeId, createContentDigest },
	{ filePath }
) => {
	const xml = readFileSync(filePath, "utf8");
	const threads = loadCommentDataFromXml(xml);

	threads.forEach(t => {
		createNode({
			id: createNodeId(`disqus-thread-${t.id}`),
			threadId: t.id,
			link: t.link,
			comments: t.comments,
			parent: null,
			children: [],
			mediaType: "application/json",
			internal: {
				type: "DisqusThread",
				content: JSON.stringify(t),
				contentDigest: createContentDigest(t)
			}
		});
	});
};

function loadCommentDataFromXml(xml) {
	const doc = new dom().parseFromString(xml);

	const select = xpath.useNamespaces({
		d: "http://disqus.com",
		dsq: "http://disqus.com/disqus-internals"
	});

	const nodes = select("/d:disqus/d:thread", doc);

	return nodes.map(node => {
		const dqId = select("string(@dsq:id)", node);
		return {
			id: select("string(d:id)", node),
			link: select("string(d:link)", node),
			comments: select(`/d:disqus/d:post[d:thread/@dsq:id='${dqId}']`, doc).map(
				cnode => ({
					id: select("string(@dsq:id)", cnode),
					parentId: select("string(d:parent/@dsq:id)", cnode),
					author: {
						name: select("string(d:author/d:name)", cnode),
						username: select("string(d:author/d:username)", cnode)
					},
					createdAt: select("string(d:createdAt)", cnode),
					message: select("string(d:message)", cnode)
				})
			)
		};
	});
}
