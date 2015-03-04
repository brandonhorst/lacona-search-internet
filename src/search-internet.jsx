/** @jsx createElement */
import {createElement, Phrase} from 'lacona-phrase'
import config from './config'
import Freetext from 'lacona-phrase-freetext'
import open from 'open'

class SearchEngines extends Phrase {
  getValue(result) {
    return result.value
  }

  describe() {
    var choices = this.props.engines.map(engine =>
      <literal text={engine.name} value={engine.url} />
    )
    return <choice id='value'>{choices}</choice>
  }
}

class SearchInternet extends Phrase {
  execute(result) {
    open(result.url.replace('{0}', result.query))
  }

  describe() {
    return (
      <sequence>
        <literal text='search ' category='action' />
        <SearchEngines category='actor' id='url' engines={this.config.searchEngines} />
        <literal text=' for ' category='conjunction' join={true} />
        <Freetext default='Lacona' category='argument' id='query' />
      </sequence>
    )
  }
}

export default {
  config: config,
  sentences: [
    SearchInternet
  ]
}
