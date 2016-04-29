/** @jsx createElement */
import _ from 'lodash'
import { createElement } from 'elliptical'
import { String } from 'elliptical-string'
import { openURL } from 'lacona-api'
import { Command } from 'lacona-command'

import demoExecute from './demo'

const SearchEngine = {
  describe ({context}) {
    const engineItems = _.map(
      context.config.webSearch.searchEngines,
      engine => ({text: engine.name, value: engine})
    )

    return (
      <repeat unique separator={<list items={[' and ', ', and ', ', ']} limit={1} category='conjunction' />}>
        <label text='search engine' suppressEmpty={false}> 
          <list items={engineItems} limit={10} strategy='fuzzy' />
        </label>
      </repeat>
    )
  }
}

const Query = {
  describe () {
    return <String limit={1} argument='query' />
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

  describe () {
    return (
      <choice limit={1}>
        <sequence>
          <literal text='search ' category='action' />
          <SearchEngine id='engines' />
          <literal text=' ' />
          <literal text='for ' decorate optional limited preferred />
          <Query id='query' />
        </sequence>
        <sequence>
          <literal text='search ' category='action' />
          <literal text='for ' category='conjunction' optional limited preferred />
          <Query id='query' />
          <list items={[' on ', ' with ', ' using ']} category='conjunction' limit={1} score={100} />
          <SearchEngine id='engines' />
        </sequence>
      </choice>
    )
  }
}

export const extensions = [SearchInternet]
