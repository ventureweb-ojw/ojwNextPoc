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

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.params.url}>
          <Link href={`/blog/${encodeURIComponent(post.params.url)}`}>
            <a>{post.params.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts