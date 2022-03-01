import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const legacyPostDirectory = "legacyBlogData";

//get file contents
const getFileContents = (id) => {
    const fullPath = path.join(legacyPostDirectory, `${id}.txt`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    return fileContents
}

const getFileNames = () => fs.readdirSync(legacyPostDirectory)

export function getLegacyPostsIds() {
    const fileNames = getFileNames();
    
    return fileNames.map(fileName => {
      return {
        params: {
          id: fileName.replace(/\.txt$/, '')
        }
      }
    })
  }

export function getLegacyPostsMeta() {
    const fileNames = getFileNames();
    return fileNames.map(fileName => {
        const fileContents = getFileContents(fileName.replace(/\.txt$/, ''));
        const matterResult = matter(fileContents);
        return {
            params: {
                ...matterResult.data
            }
        }
    })

}

export function getLegacyPostData(id) {
    const fileContents = getFileContents(id);
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
  
    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
      ...{ content: matterResult.content }
    }
  }