/** @jsx createElement */
import _ from 'lodash'
import {createElement, Phrase} from 'lacona-phrase'
import String from 'lacona-phrase-string'
import Config from 'LaconaCommand-Config'

class SearchEngines extends Phrase {
  source () {
    return {config: <Config />}
  }

  describe () {
    if (!this.sources.config.data.webSearch) return null

    const choices = this.sources.config.data.webSearch.searchEngines.map(engine => <literal text={engine.name} value={engine.url} />)

    return (
      <repeat unique={true} separator={<list items={[' and ', ', and ', ', ']} limit={1} />}>
        <argument text='search engine'>
          <choice>{choices}</choice>
        </argument>
      </repeat>
    )
  }
}

class Query extends Phrase {
  describe () {
    return <String limit={1} argument='query' />
  }
}

export function execute (result) {
  const query = encodeURI(result.query)
  _.forEach(result.urls, url => {
    global.openURL(url.replace('{0}', query))
  })
}

export class Sentence extends Phrase {
  describe () {
    return (
      <choice limit={1}>
        <sequence>
          <literal text='search ' category='action' />
          <SearchEngines id='urls' />
          <literal text=' for ' />
          <Query id='query' />
        </sequence>
        <sequence>
          <literal text='search ' category='action' />
          <literal text='for ' category='conjunction' optional={true} />
          <Query id='query' />
          <choice limit={1} category='conjunction'>
            <literal text=' on ' />
            <literal text=' with ' />
            <literal text=' using ' />
          </choice>
          <SearchEngines id='urls' />
        </sequence>
      </choice>
    )
  }
}

// export default {
//   config: config,
//   sentences: [
//     SearchInternet
//   ],
//   translations: [{
//     langs: ['en', 'default'],
//     information: {
//       title: 'Search Internet',
//       description: 'Search various search engines',
//       examples: ['search Google for pictures of cats', 'search for Red Sox on Yahoo']
//     }
//   }]
// }
