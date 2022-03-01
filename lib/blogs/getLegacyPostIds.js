import fs from 'fs'

export function getLegacyPostIds() {
    const fileNames = fs.readdirSync('legacyBlogData');
    
    return fileNames.map(fileName => {
      return {
        params: {
          id: fileName.replace(/\.txt$/, '')
        }
      }
    })
  }