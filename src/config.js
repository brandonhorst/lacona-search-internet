export default {
  searchEngines: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        url: {type: 'string'}
      }
    },
    default: [
      {name: 'Google', url: 'https://www.google.com/search?q={0}'},
      {name: 'Yahoo', url: 'https://search.yahoo.com/search?p={0}'},
      {name: 'Bing', url: 'https://www.bing.com/search?q={0}'}
    ]
  }
}
