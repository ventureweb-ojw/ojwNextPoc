import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export function getLegacyPostData(id) {
    const fullPath = path.join('legacyBlogData', `${id}.txt`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
  
    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
      ...{ content: matterResult.content }
    }
  }