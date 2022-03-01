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
  const postData = getLegacyPostData(params.id)
  return {
    props: {
      postData
    }
  }
}

const Post = ({ postData }) => {
  const router = useRouter()
  const { id } = router.query
  return <div>
            <Image
                src={postData.img} 
                alt=""
                width="2000"
                height="1333"
                layout="responsive"
              />
            <div style={{ 
              maxWidth: '900px',
              margin: 'auto'
              }}>  
              <h1>{postData.title}</h1>
              <p>Post: {id} - {postData.title}</p>
              <div dangerouslySetInnerHTML={{ __html: postData.content }}></div>
            </div>
          </div>
  
}

export default Post