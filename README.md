# Gatsby Disqus XML Source Plugin

> A [Gatsby](https://github.com/gatsbyjs/gatsby) source plugin to use a [Disqus XML export](https://help.disqus.com/developer/comments-export) as a data source.

Given a Disqus XML export, this source plugin will make threads & comments available to query via GraphQL. This will allow you to statically render comments and not include the Disqus embed code on your site. This can be useful if you are trying to migrate away from Disqus but you don't want to lose your existing comments. Or it could be useful if you want to server-render your comments for SEO purposes and replace the comment `div` with the Disqus embed code at runtime.

## Install

```
yarn add gatsby-source-disqus-xml
```

or

```
npm install gatsby-source-disqus-xml
```

## How to use

In `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-disqus-xml`,
      options: {
        filePath: "my_disqus_export.xml"
      },
    },
  ],
}
```

### Query for Nodes

You can query for **all** threads:

```graphql
{
  allDisqusThread {
    edges {
      node {
        threadId
        link
        comments {
          id
          parentId
          author {
            name
            username
          }
          createdAt
          message
        }
      }
    }
  }
}
```

or for a specific thread:

```graphql
{
  query CommentThreadById($threadId: String!) {
    disqusThread( threadId: { eq: $threadId }) {
      threadId
      link
      comments {
        id
        parentId
        author {
          name
          username
        }
        createdAt
        message
      }
    }
  }
}
```
