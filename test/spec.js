/* global describe, it */
var assert = require('assert')
var mocha = require('mocha')

function runSpecTests (rdf) {
  describe('RDF-Graph', function () {
    describe('Node', function () {
      var implementsNodeInterface = function (node) {
        it('should implement the Node interface', function () {
          assert.equal(typeof node.nominalValue, 'string')
          assert.equal(typeof node.interfaceName, 'string')
          assert.equal(typeof node.equals, 'function')
          assert.equal(typeof node.toString, 'function')
          assert.equal(typeof node.toNT, 'function')
          assert.equal(typeof node.valueOf, 'function')
        })
      }

      describe('NamedNode', function () {
        implementsNodeInterface(new rdf.NamedNode('http://example.org'))

        it('.nominalValue should contain the IRI', function () {
          var node = new rdf.NamedNode('http://example.org')

          assert.equal(node.nominalValue, 'http://example.org')
        })

        it('.interfaceName should contain the string "NamedNode"', function () {
          var node = new rdf.NamedNode('http://example.org')

          assert.equal(node.interfaceName, 'NamedNode')
        })

        it('.equals should return true if all attributes are equivalent', function () {
          var nodeA = new rdf.NamedNode('http://example.org')
          var nodeB = new rdf.NamedNode('http://example.org')
          var nodeC = new rdf.NamedNode('http://example.com')

          assert(nodeA.equals(nodeB))
          assert(!nodeA.equals(nodeC))
        })

        it('.equals should return true if compared against the nominalValue of the NamedNode', function () {
          var node = new rdf.NamedNode('http://example.org')

          assert(node.equals(node.nominalValue))
          assert(!node.equals('test'))
        })

        it('.equals should return true if the stringified representation matches a RegExp', function () {
          var node = new rdf.NamedNode('http://example.org')

          assert(node.equals(new RegExp('http.*')))
          assert(!node.equals(new RegExp('ftp.*')))
        })

        it('.toNT should return the N-Triple representation', function () {
          var node = new rdf.NamedNode('http://example.org')

          assert.equal(node.toNT(), '<http://example.org>')
        })

        it('.toString should return the nominalValue', function () {
          var node = new rdf.NamedNode('http://example.org')

          assert.equal(node.toString(), 'http://example.org')
        })

        it('.valueOf should return the nominalValue', function () {
          var node = new rdf.NamedNode('http://example.org')

          assert.equal(node.valueOf(), node.nominalValue.toString())
        })
      })

      describe('BlankNode', function () {
        implementsNodeInterface(new rdf.BlankNode())

        it('.nominalValue may also be defined by constructor', function () {
          var label = 'a1'
          var bnode = new rdf.BlankNode(label)

          assert.equal(bnode.nominalValue.toString(), label)
        })

        it('.nominalValue should generate unique labels', function () {
          var bnode1 = new rdf.BlankNode()
          var bnode2 = new rdf.BlankNode()

          assert.notEqual(bnode1.nominalValue.toString(), bnode2.nominalValue.toString())
        })

        it('.nominalValue should be a stringifyable value', function () {
          var node = new rdf.BlankNode()

          assert(node.nominalValue.toString())
        })

        it('.interfaceName should contain the string "BlankNode"', function () {
          var node = new rdf.BlankNode()

          assert.equal(node.interfaceName, 'BlankNode')
        })

        it('.equals should return true if all attributes are equivalent', function () {
          var nodeA = new rdf.BlankNode()
          var nodeB = nodeA
          var nodeC = new rdf.BlankNode()

          assert(nodeA.equals(nodeB))
          assert(!nodeA.equals(nodeC))
        })

        it('.equals should return true when comparing two bnodes with identical labels', function () {
          var nodeA = new rdf.BlankNode('a1')
          var nodeB = new rdf.BlankNode('a1')

          assert(nodeA.equals(nodeB))
        })

        it('.equals should return true if compared against the nominalValue BlankNode', function () {
          var node = new rdf.BlankNode()

          assert(node.equals(node.valueOf()))
          assert(!node.equals('test'))
        })

        it('.equals should return true if the nominalValue matches a RegExp', function () {
          var node = new rdf.BlankNode()

          assert(node.equals(new RegExp('b')))
          assert(!node.equals(new RegExp('<')))
        })

        it('.toNT should return the N-Triple representation', function () {
          var node = new rdf.BlankNode()

          assert.equal(node.toNT(), '_:' + node.nominalValue.toString())
        })

        it('.toString should return the nominalValue prepended with "_:"', function () {
          var node = new rdf.BlankNode()

          assert.equal(node.toString(), '_:' + node.nominalValue.toString())
        })

        it('.valueOf should return the native value', function () {
          var node = new rdf.BlankNode()

          assert.equal(node.valueOf(), node.nominalValue.toString())
        })
      })

      describe('Literal', function () {
        implementsNodeInterface(new rdf.Literal('test'))

        it('should implement the Node interface', function () {
          var languageNode = new rdf.Literal('test', 'en')
          var datatypeNode = new rdf.Literal('test', null, new rdf.NamedNode('http://exaple.org'))

          assert.equal(typeof languageNode.language, 'string')
          assert.equal(typeof datatypeNode.datatype, 'object')
        })

        it('.nominalValue should be a stringifyable value', function () {
          var node = new rdf.Literal('test')

          assert.equal(node.nominalValue, 'test')
        })

        it('.interfaceName should contain the string "Literal"', function () {
          var node = new rdf.Literal('test')

          assert.equal(node.interfaceName, 'Literal')
        })

        it('.equals should return true if all attributes are equivalent', function () {
          var nodeA = new rdf.Literal('test')
          var nodeB = new rdf.Literal('test')
          var nodeC = new rdf.Literal('other')
          var nodeD = new rdf.Literal('test', 'en')
          var nodeE = new rdf.Literal('test', null, new rdf.NamedNode('http://example.org'))

          assert(nodeA.equals(nodeB))
          assert(!nodeA.equals(nodeC))
          assert(!nodeA.equals(nodeD))
          assert(!nodeA.equals(nodeE))
        })

        it('.equals should support number literals', function () {
          var nodeA = new rdf.Literal('1.23')
          var nodeB = new rdf.Literal(1.23)

          assert(nodeA.equals(nodeB))
        })

        it('.equals should support plain string value', function () {
          var node = new rdf.Literal('test')

          assert(node.equals('test'))
          assert(!node.equals('example'))
        })

        it('.equals should support RegExp matching', function () {
          var node = new rdf.Literal('test')

          assert(node.equals(new RegExp('t.*')))
          assert(!node.equals(new RegExp('i.*')))
        })

        it('.toNT should return the N-Triple representation', function () {
          var node = new rdf.Literal('test')

          assert.equal(node.toNT(), '"test"')
        })

        it('.toNT should return the N-Triple representation of a Number', function () {
          var node = new rdf.Literal(1.23)

          assert.equal(node.toNT(), '"1.23"')
        })

        it('.toNT should return the N-Triple representation including the language', function () {
          var node = new rdf.Literal('test', 'en')

          assert.equal(node.toNT(), '"test"@en')
        })

        it('.toNT should return the N-Triple representation including the datatype', function () {
          var node = new rdf.Literal('test', null, new rdf.NamedNode('http://example.org'))

          assert.equal(node.toNT(), '"test"^^<http://example.org>')
        })

        it('.toString should return the nominalValue prepended with "_:"', function () {
          var node = new rdf.BlankNode()

          assert.equal(node.toString(), '_:' + node.nominalValue.toString())
        })

        it('.valueOf should return the native value', function () {
          var node = new rdf.BlankNode()

          assert.equal(node.valueOf(), node.nominalValue.toString())
        })
      })
    })

    describe('Triple', function () {
      it('should implement the Triple interface', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/object'))

        assert.equal(typeof triple.subject, 'object')
        assert.equal(typeof triple.predicate, 'object')
        assert.equal(typeof triple.object, 'object')
        assert.equal(typeof triple.toString, 'function')
        assert.equal(typeof triple.equals, 'function')
      })

      it('.equals should return true if the triple is equivalent', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))

        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))

        var tripleC = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test', 'en'))

        assert(tripleA.equals(tripleB))
        assert(!tripleA.equals(tripleC))
      })

      it('.toNT should return the N-Triples representation', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test', 'en'))

        assert.equal(triple.toNT(), '<http://example.org/subject> <http://example.org/predicate> "test"@en .')
      })

      it('.toString should return the N-Triples representation', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test', 'en'))

        assert.equal(triple.toString(), '<http://example.org/subject> <http://example.org/predicate> "test"@en .')
      })
    })

    describe('Quad', function () {
      it('should implement the Quad interface', function () {
        var quad = new rdf.Quad(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/object'),
          new rdf.NamedNode('http://example.org/graph'))

        assert.equal(typeof quad.subject, 'object')
        assert.equal(typeof quad.predicate, 'object')
        assert.equal(typeof quad.object, 'object')
        assert.equal(typeof quad.graph, 'object')
        assert.equal(typeof quad.toString, 'function')
        assert.equal(typeof quad.equals, 'function')
      })

      it('.equals should return true if the triple is equivalent', function () {
        var quadA = new rdf.Quad(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'),
          new rdf.NamedNode('http://example.org/graph'))

        var quadB = new rdf.Quad(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'),
          new rdf.NamedNode('http://example.org/graph'))

        var quadC = new rdf.Quad(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test', 'en'),
          new rdf.NamedNode('http://example.org/graph'))

        var quadD = new rdf.Quad(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test', 'en'),
          new rdf.NamedNode('http://example.org/otherGraph'))

        assert(quadA.equals(quadB))
        assert(!quadA.equals(quadC))
        assert(!quadC.equals(quadD))
      })

      it('.toNT should return the N-Quads representation', function () {
        var quad = new rdf.Quad(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test', 'en'),
          new rdf.NamedNode('http://example.org/graph'))

        assert.equal(quad.toNT(), '<http://example.org/subject> <http://example.org/predicate> "test"@en <http://example.org/graph> .')
      })

      it('.toString should return the N-Quads representation', function () {
        var quad = new rdf.Quad(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test', 'en'),
          new rdf.NamedNode('http://example.org/graph'))

        assert.equal(quad.toString(), '<http://example.org/subject> <http://example.org/predicate> "test"@en <http://example.org/graph> .')
      })
    })

    describe('Graph', function () {
      var spoFilter = function (s, p, o) {
        return function (triple) {
          return (!s || triple.subject.equals(s)) && (!p || triple.predicate.equals(p)) && (!o || triple.object.equals(o))
        }
      }

      it('should implement the Graph interface', function () {
        var graph = new rdf.Graph()

        assert.equal(typeof graph.length, 'number')
        assert.equal(typeof graph.add, 'function')
        assert.equal(typeof graph.remove, 'function')
        assert.equal(typeof graph.removeMatches, 'function')
        assert.equal(typeof graph.toArray, 'function')
        assert.equal(typeof graph.some, 'function')
        assert.equal(typeof graph.every, 'function')
        assert.equal(typeof graph.filter, 'function')
        assert.equal(typeof graph.forEach, 'function')
        assert.equal(typeof graph.match, 'function')
        assert.equal(typeof graph.merge, 'function')
        assert.equal(typeof graph.addAll, 'function')
        assert.equal(typeof graph.actions, 'object')
        assert.equal(typeof graph.addAction, 'function')
      })

      it('.length should contain the number of triples in the graph', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))
        var graph = new rdf.Graph([triple])

        assert.equal(graph.length, 1)
      })

      it('.add should add triples to the graph', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))
        var graph = new rdf.Graph()

        graph.add(triple)

        assert(triple.equals((graph.toArray().shift())))
      })

      it('.add should not create duplicates', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))
        var graph = new rdf.Graph()

        graph.add(triple)
        graph.add(triple)

        assert.equal(graph.length, 1)
      })

      it('.difference should return a graph with triples not included in the other graph', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('a'))
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('b'))
        var tripleC = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('c'))
        var graphA = new rdf.Graph([tripleA, tripleB])
        var graphB = new rdf.Graph([tripleB, tripleC])
        var graphC = graphA.difference(graphB)

        assert.equal(graphC.length, 1)
        assert(tripleA.equals(graphC.toArray().shift()))
      })

      it('.equals should compare the other graph for equality', function () {
        var tripleA1 = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.BlankNode())
        var tripleA2 = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.BlankNode())
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))
        var graphA = new rdf.Graph([tripleA1])
        var graphB = new rdf.Graph([tripleA2])
        var graphC = new rdf.Graph([tripleB])

        assert.equal(graphA.equals(graphB), true)
        assert.equal(graphA.equals(graphC), false)
      })

      it('.includes should test if the graph contains the given triple', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))
        var otherTriple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('other'))
        var graph = new rdf.Graph([triple])

        assert.equal(graph.includes(triple), true)
        assert.equal(graph.includes(otherTriple), false)
      })

      it('.intersection should return a graph with triples included also in the other graph', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('a'))
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('b'))
        var tripleC = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('c'))
        var graphA = new rdf.Graph([tripleA, tripleB])
        var graphB = new rdf.Graph([tripleB, tripleC])
        var graphC = graphA.intersection(graphB)

        assert.equal(graphC.length, 1)
        assert(tripleB.equals(graphC.toArray().shift()))
      })

      it('.remove should remove the given triple', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))
        var graph = new rdf.Graph([triple])

        graph.remove(triple)

        assert.equal(graph.length, 0)
      })

      it('.removeMatches should remove triples based on the given match parameters', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))
        var graph = new rdf.Graph()

        graph.add(triple)
        graph.removeMatches('http://example.org/subject')
        assert.equal(graph.length, 0)

        graph.add(triple)
        graph.removeMatches(null, 'http://example.org/predicate')
        assert.equal(graph.length, 0)

        graph.add(triple)
        graph.removeMatches(null, null, 'test')
        assert.equal(graph.length, 0)

        graph.add(triple)
        graph.removeMatches('http://example.org/subject', 'http://example.org/predicate', 'test')
        assert.equal(graph.length, 0)

        graph.add(triple)
        graph.removeMatches('http://example.org/subject', 'http://example.org/predicate', 'example')
        assert.equal(graph.length, 1)
      })

      it('.toArray should return all triples in an array', function () {
        var triple = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.Literal('test'))
        var graph = new rdf.Graph([triple])

        assert(triple.equals(graph.toArray().shift()))
      })

      it('.some should return true if some triples pass the filter test', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectA'))
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectB'))
        var graph = new rdf.Graph([tripleA, tripleB])

        assert(graph.some(spoFilter(null, null, 'http://example.org/objectA')))
        assert(graph.some(spoFilter('http://example.org/subject', null, null)))
        assert(!graph.some(spoFilter(null, null, 'http://example.org/objectC')))
      })

      it('.every should return true if every triple pass the filter test', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectA'))
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectB'))
        var graph = new rdf.Graph([tripleA, tripleB])

        assert(graph.every(spoFilter('http://example.org/subject', null, null)))
        assert(!graph.every(spoFilter(null, null, 'http://example.org/objectA')))
      })

      it('.filter should return a new graph that contains all triples that pass the filter test', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectA'))
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectB'))
        var graph = new rdf.Graph([tripleA, tripleB])

        assert.equal(graph.filter(spoFilter('http://example.org/subject', null, null)).length, 2)
        assert.equal(graph.filter(spoFilter(null, null, 'http://example.org/objectA')).length, 1)
        assert.equal(graph.filter(spoFilter(null, null, 'http://example.org/objectC')).length, 0)
      })

      it('.forEach should call the callback function for every triple', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectA'))
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectB'))
        var graph = new rdf.Graph([tripleA, tripleB])
        var objects = []

        graph.forEach(function (triple) {
          objects.push(triple.object)
        })

        assert.equal(objects.length, 2)
        assert.equal(objects.join(' '), 'http://example.org/objectA http://example.org/objectB')
      })

      it('.match should return a new graph that contains all triples that pass the given match parameters', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectA'))
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectB'))
        var graph = new rdf.Graph([tripleA, tripleB])

        assert.equal(graph.match('http://example.org/subject', null, null).length, 2)
        assert.equal(graph.match(null, null, 'http://example.org/objectB').length, 1)
        assert.equal(graph.match(null, null, 'http://example.org/objectC').length, 0)
      })

      it('.merge should return a new graph that contains all triples from the graph object and the given graph', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectA'))
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectB'))
        var graphA = new rdf.Graph([tripleA])
        var graphB = new rdf.Graph([tripleB])
        var graphC = graphA.merge(graphB)

        assert.equal(graphA.length, 1)
        assert.equal(graphB.length, 1)
        assert.equal(graphC.length, 2)
      })

      it('.addAll should import all triples from the given graph', function () {
        var tripleA = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectA'))
        var tripleB = new rdf.Triple(
          new rdf.NamedNode('http://example.org/subject'),
          new rdf.NamedNode('http://example.org/predicate'),
          new rdf.NamedNode('http://example.org/objectB'))
        var graphA = new rdf.Graph([tripleA])
        var graphB = new rdf.Graph([tripleB])
        var graphC = graphA.addAll(graphB)

        assert.equal(graphA.length, 2)
        assert.equal(graphB.length, 1)
        assert.equal(graphC.length, 2)
      })

      /* it('.actions should be a readable array that contains all actions', function () {
       var graph = new rdf.Graph()
       var triple = new rdf.Triple(
       new rdf.NamedNode('http://example.org/subject'),
       new rdf.NamedNode('http://example.org/predicate'),
       new rdf.NamedNode('http://example.org/object'))
       var testCalled = false
       var loopCalled = false
       var action = new rdf.TripleAction(function () {
       testCalled = true
       return true
       }, function () {
       loopCalled = true
       })

       graph.addAction(action)
       graph.add(triple)

       assert(testCalled)
       assert(loopCalled)
       })

       it('.addAction should add an action that is called as filter and loop callback', function () {
       var graph = new rdf.Graph()
       var action = new rdf.TripleAction(function () {
       return true
       }, function () {})

       graph.addAction(action)

       assert(graph.actions.indexOf(action) >= 0)
       }) */
    })
  })
}

module.exports = runSpecTests

if (typeof mocha !== 'undefined') {
  var rdf = global.rdf || require(process.cwd())

  runSpecTests(rdf)
}
