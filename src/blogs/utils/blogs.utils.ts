export const slugify = (title: string, authorId): string => {
  if(title){
    return `${title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')}-${authorId}${new Date().getUTCMilliseconds()}`;
  }
}
