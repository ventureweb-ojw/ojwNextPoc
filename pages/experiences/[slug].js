// pages/experiences/[slug].js
import ErrorPage from 'next/error'
import {useRouter} from 'next/router'
import {groq} from 'next-sanity'
import {PortableText} from '@portabletext/react'
import {usePreviewSubscription, urlFor} from '../../lib/sanity'
import {getClient} from '../../lib/sanity.server'
import {PreviewExit} from '../../components/preview-exit'

const components = {
  block: {
    // Ex. 1: customizing common block types
    h3: ({children}) => <h3 style={{ color: 'pink' }}>{children}</h3>,
    marks: {
      link: ({children, value}) => {
        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
        return (
          <a href={value.href} rel={rel}>
            {children}
          </a>
        )
      },
    },
  },
}

/**
 * Helper function to return the correct version of the document
 * If we're in "preview mode" and have multiple documents, return the draft
 */
 function filterDataToSingleItem(data, preview) {
  if (!Array.isArray(data)) {
    return data
  }

  if (data.length === 1) {
    return data[0]
  }

  if (preview) {
    return data.find((item) => item._id.startsWith(`drafts.`)) || data[0]
  }
  
  return data[0]
}

export async function getStaticPaths() {

  const allSlugsQuery = groq`*[_type == "experience" && defined(slug.current)][].data.slug.current`
  const pages = await getClient().fetch(allSlugsQuery)

  return {
    paths: pages.map((slug) => `/${slug}`),
    fallback: true,
  }
}

export async function getStaticProps({params, preview = false}) {

  const query = groq`*[_type == "experience" && data.slug.current == $slug]`
  const queryParams = {slug: params.slug}
  const fetchedData = await getClient(preview).fetch(query, queryParams)

  // Escape hatch, if our query failed to return data
  if (!fetchedData) return {notFound: true}

  // Helper function to reduce all returned documents down to just one
  const data = filterDataToSingleItem(fetchedData, preview)
  const _return = {
    props: {
      slug: params.slug,
      // Pass down the "preview mode" boolean to the client-side
      preview,
      // Pass down the initial content, and our query
      data,
      query,
      queryParams
    }
  }
  //console.log('gsp', _return);
  return _return
}

export default function Experience({slug, data, query, queryParams, preview}) {

  const {data: previewData} = usePreviewSubscription(query, {
    params: queryParams ?? {},
    initialData: data,
    enabled: preview,
  })

  if(preview && previewData) {
    // Client-side uses the same query, so we may need to filter it down again
    data = filterDataToSingleItem(previewData, preview)
  }

  //console.log(fooBar);
  return (
    <div>
      {
        preview && (
          <PreviewExit 
          slug={slug} 
          />
        )
      }
      <div style={{maxWidth: `20rem`, padding: `1rem`}}>
        {data?.data?.title && <h1>{data.data?.title}</h1>}
        {
          data?.data?.description && 
          <PortableText 
            value={data.data?.description} 
            components={components}
          />
        }
      </div>
     </div>
  )
}

