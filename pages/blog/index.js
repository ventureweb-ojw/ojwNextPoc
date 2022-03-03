import Link from 'next/link'
import { getLegacyPostsMeta } from '../../lib/blogs/legacyPosts.js'

export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.id
    const posts = getLegacyPostsMeta()
    return {
      props: {
        posts
      }
    }
  }

function Posts({ posts }) {
  //sort the posts so they display in date order
  posts.sort((a,b) => new Date(b.params.date) - new Date(a.params.date))

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.params.url}>
          <Link href={`/blog/${encodeURIComponent(post.params.url)}`}>
            <a>{post.params.date} - {post.params.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts