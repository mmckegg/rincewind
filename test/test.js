var getTemplate = require('../')

var test = require('tape')


test('Root template binding', function(t){
  t.plan(1)

  var get = createGetter({
    title: 'Page Title',
    type: 'page'
  })

  var render = getTemplate('<div> <h1 id="heading" t:bind="title" /> <div t:bind:class="type">Content</div> </div>')
  var expected = '<div> <h1 id="heading">Page Title</h1> <div class="page">Content</div> </div>'

  t.equal(getHtml(render(get)), expected)
})


test('Repeater', function(t){
  t.plan(1)

  var get = createGetter({
    items: [
      {name: 'Item 1', type: 'Thing'},
      {name: 'Item 2', type: 'OtherThing'}
    ]
  })

  var render = getTemplate('<ul> <li t:repeat="items" t:bind=".name" t:bind:class=".type" /> </ul>')
  var expected = '<ul> <li class="Thing">Item 1</li><li class="OtherThing">Item 2</li> </ul>'

  t.equal(getHtml(render(get)), expected)
})

test('Inner view', function(t){
  t.plan(1)

  var get = createGetter({
    items: [
      {name: 'Item 1', type: 'Thing'},
      {name: 'Item 2', type: 'OtherThing'}
    ]
  })

  var render = getTemplate('<div> <h1>Title</h1> <div t:view="inner" /> </div>')
  render.addView('<ul> <li t:repeat="items" t:bind=".name" t:bind:class=".type" /> </ul>', 'inner')

  var expected = '<div> <h1>Title</h1> <div><ul> <li class="Thing">Item 1</li><li class="OtherThing">Item 2</li> </ul></div> </div>'

  t.equal(getHtml(render(get)), expected)
})

test('Inner view with placeholder', function(t){
  t.plan(1)

  var get = createGetter({
    items: [
      {name: 'Item 1', type: 'Thing'},
      {name: 'Item 2', type: 'OtherThing'}
    ]
  })

  var render = getTemplate('<div> <h1>Title</h1> <t:placeholder t:view="inner" /> </div>')
  render.addView('<ul> <li t:repeat="items" t:bind=".name" t:bind:class=".type" /> </ul>', 'inner')

  var expected = '<div> <h1>Title</h1> <ul> <li class="Thing">Item 1</li><li class="OtherThing">Item 2</li> </ul> </div>'

  t.equal(getHtml(render(get)), expected)
})

test('Conditional elements', function(t){
  t.plan(1)

  var get = createGetter({
    showFirst: true,
    showSecond: false
  })

  var render = getTemplate('<div> <span t:if="showFirst">First</span> <span t:if="showSecond">Second</span> </div>')

  var expected = '<div> <span>First</span>  </div>'

  t.equal(getHtml(render(get)), expected)
})

function getHtml(elements){
  return elements.map(function(element){
    return element.outerHTML
  }).join('')
}

function createGetter(data){
  return function(query, options){
    if (query.charAt(0) == '.'){
      return (options.source || data)[query.slice(1)]
    } else {
      return data[query] 
    }
  }
}
