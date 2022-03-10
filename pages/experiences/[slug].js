// pages/experiences/[slug].js
import ErrorPage from 'next/error'
import {useRouter} from 'next/router'
import {groq} from 'next-sanity'
import {PortableText} from '@portabletext/react'
import {usePreviewSubscription, urlFor} from '../../lib/sanity'
import {getClient} from '../../lib/sanity.server'
import {PreviewExit} from '../../components/preview-exit'
import { MemberBusinessLink } from '../../components/member-business-link'
import { InternalLink } from '../../components/internal-link'

const components = {
  block: {
    // Ex. 1: customizing common block types
    h3: ({children}) => <h3 style={{ color: 'pink' }}>{children}</h3>,
  },
  marks: {
    link: ({children, value}) => {
      const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value?.slug} rel={rel}>
          {children}
        </a>
      )
    },
    memberBusinessLink: ({children, value}) => {
      return (
        <MemberBusinessLink
          value={value}
        >{ children }</MemberBusinessLink>
      )
    },
    internalLink: ({children, value}) => {
      return (
       <InternalLink
        value={value}
       >{ children }</InternalLink>
      )
    }
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

//return the paths that should be built at build time
//incorrect paths are figured out in getStaticProps (notFound)
export async function getStaticPaths() {
  const allSlugsQuery = groq`*[_type == "experience"][].data.slug.current`
  const pages = await getClient().fetch(allSlugsQuery)
  const paths = pages.map((slug) => `/experiences/${slug}`);
  return {
    //below to check isr loading of paths that are not specified
    paths: [
      '/experiences/the-rain-in-spain',
    ],
    fallback: 'blocking'
  }
}

export async function getStaticProps({params, preview = false}) {

  const query = groq`
  *[_type == "experience" && data.slug.current == $slug]{
    ...,
    data{
      ...,
      description[]{
        ...,
        markDefs[]{
          ...,
          _type == "internalLink" => {
            "slug": @.reference->data.slug,
            "type": @.reference->_type,
            "entity": @.reference->
          }
        }
      }
    },
    "slug": data.slug.current,
  }
  `
  const queryParams = {slug: params.slug}
  const fetchedData = await getClient(preview).fetch(query, queryParams)
  
  // Escape hatch, if our query failed to return data or empty array
  if (!fetchedData || fetchedData.length < 1) return { notFound: true }

  // Helper function to reduce all returned documents down to just one
  const data = filterDataToSingleItem(fetchedData, preview)
  
  return {
    props: {
      slug: params.slug,
      // Pass down the "preview mode" boolean to the client-side
      preview,
      // Pass down the initial content, and our query
      data,
      query,
      queryParams
    },
    revalidate: 60, //once per minute - example
  }
}

export default function Experience({slug, data, query, queryParams, preview}) {

  //React Hooks must be called in the exact same order in every component render.  
  //react-hooks/rules-of-hooks
  const {data: previewData} = usePreviewSubscription(query, {
    params: queryParams ?? {},
    initialData: data,
    enabled: preview,
  })

  if(!data) {
    return <ErrorPage statusCode={404} />
  }

  if(preview && previewData) {
    // Client-side uses the same query, so we may need to filter it down again
    data = filterDataToSingleItem(previewData, preview)
  }

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

