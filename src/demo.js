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

export default function demoExecute (result) {
  return _.flatten([
    {text: 'open ', category: 'action'},
    andify(result.engines),
    {text: ' for ' },
    {text: result.query, argument: 'query'},
    {text: ' in '},
    {text: 'the default web browser', argument: 'application'}
  ])
}