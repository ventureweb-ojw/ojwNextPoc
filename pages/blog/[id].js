import { useRouter } from 'next/router'
import Image from 'next/image'
import { getLegacyPostsIds, getLegacyPostData } from '../../lib/blogs/legacyPosts.js';

export async function getStaticPaths() {
  const paths = getLegacyPostsIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  const data = getLegacyPostData(params.id)
  return {
    props: {
      data
    }
  }
}

const Post = ({ data }) => {
  return <div>
            <Image
                src={data.img} 
                alt=""
                width="2000"
                height="1333"
                layout="responsive"
              />
            <div style={{ 
              maxWidth: '900px',
              margin: 'auto'
              }}>  
              <h1>{data.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </div>
          </div>
  
}

export default Post