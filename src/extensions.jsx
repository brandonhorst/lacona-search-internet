/** @jsx createElement */
import _ from 'lodash'

import { createElement } from 'elliptical'
import { String, Command } from 'lacona-phrases'
import { openURL } from 'lacona-api'

import demoExecute from './demo'

const SearchEngine = {
  describe ({props}) {
    const engineItems = _.map(
      props.engines,
      engine => ({text: engine.name, value: engine})
    )

    return (
      <repeat unique separator={<list items={[' and ', ', and ', ', ']} limit={1} category='conjunction' />}>
        <placeholder argument='search engine' suppressEmpty={false}> 
          <list items={engineItems} limit={10} strategy='fuzzy' />
        </placeholder>
      </repeat>
    )
  }
}

const Query = {
  describe ({props}) {
    return <String limit={1} label='query' splitOn={/\s/} {...props} />
  }
}

export const SearchInternet = {
  extends: [Command],

  execute (result) {
    const query = encodeURIComponent(result.query)
    _.forEach(result.engines, ({url}) => {
      const trueURL = url.replace('${query}', query)
      openURL({url: trueURL})
    })
  },
  demoExecute,

  describe ({config}) {
    if (!config.searchEnabled) return

    return (
      <choice limit={1}>
        <sequence>
          <literal text='search ' />
          <SearchEngine id='engines' engines={config.searchEngines} />
          <literal text=' ' />
          <literal text='for ' decorate optional limited preferred />
          <Query id='query' consumeAll />
        </sequence>
        <sequence>
          <literal text='search ' />
          <literal text='for ' optional limited preferred />
          <Query id='query' />
          <list items={[' on ', ' with ', ' using ']} limit={1} score={100} />
          <SearchEngine id='engines' engines={config.searchEngines} />
        </sequence>
      </choice>
    )
  }
}

export default [SearchInternet]
