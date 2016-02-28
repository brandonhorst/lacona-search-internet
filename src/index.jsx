/** @jsx createElement */
import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { String } from 'lacona-phrase-string'
import { openURL, fetchSearchEngines, Config } from 'lacona-api'
import { Command } from 'lacona-command'

function andify (array, separator = ',') {
  if (array.length === 1) {
    return [
      {text: 'a '},
      {text: array[0].name, argument: 'search engine'},
      {text: ' search'}
    ]
  } else {
    return _.chain(array)
      .slice(0, -2)
      .map(item => [{text: item.name, argument: 'search engine'}, {text: ', '}])
      .flatten()
      .concat({text: _.slice(array, -2, -1)[0].name, argument: 'search engine'})
      .concat({text: ' and '})
      .concat({text: _.slice(array, -1)[0].name, argument: 'search engine'})
      .concat({text: ' searches'})
      .value()
  }
}

class SearchEngine extends Phrase {
  observe () {
    return <Config property='webSearch' />
  }

  describe () {
    // const searchEngines = this.source.data ? this.source.data.searchEngines : []
    const engineItems = _.map(this.source.data.searchEngines, engine => ({text: engine.name, value: engine}))

    return (
      <repeat unique separator={<list items={[' and ', ', and ', ', ']} limit={1} category='conjunction' />}>
        <label text='search engine' suppressEmpty={false} suppress={this.props.suppress}>
          <list items={engineItems} limit={10} fuzzy />
        </label>
      </repeat>
    )
  }
}

class Query extends Phrase {
  describe () {
    return <String limit={1} argument='query' />
  }
}

class CommandObject {
  constructor ({query, engines}) {
    this.query = query
    this.engines = engines
  }

  execute () {
    const query = encodeURIComponent(this.query)
    _.forEach(this.engines, ({url}) => {
      const trueURL = url.replace('${query}', query)
      openURL({url: trueURL})
    })
  }

  _demoExecute () {
    return _.flatten([
      {text: 'open ', category: 'action'},
      andify(this.engines),
      {text: ' for ' },
      {text: this.query, argument: 'query'},
      {text: ' in '},
      {text: 'the default web browser', argument: 'application'}
    ])
  }
}

export class SearchInternet extends Phrase {
  static extends = [Command]

  describe () {
    return (
      <map function={result => new CommandObject(result)}>
        <choice limit={1}>
          <sequence>
            <literal text='search ' category='action' />
            <SearchEngine id='engines' />
            <literal text=' ' />
            <literal text='for ' decorate />
            <Query id='query' />
          </sequence>
          <sequence>
            <literal text='search ' category='action' />
            <literal text='for ' category='conjunction' optional limited prefered />
            <Query id='query' />
            <list items={[' on ', ' with ', ' using ']} category='conjunction' limit={1} score={100} />
            <SearchEngine id='engines' />
          </sequence>
        </choice>
      </map>
    )
  }
}

export const extensions = [SearchInternet]
