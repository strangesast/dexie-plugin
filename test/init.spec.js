var assert = require('assert');
var { GitDexie } = require('../index.js');
var { Element } = require('../models.js');


describe('init repo', () => {
  var db;
  it('should clone repo and create index', async() => {
    db = new GitDexie('toast');

    let element = new Element('toast', 'this is toast');

    await db.elements.add(element);

    await db.elements.gitAdd(element);

    element.name = 'toast toast';
    element.state = 0;
    element.updateHash();
    await db.elements.add(element);

    console.log('staged', await db.elements.gitStatus());
  });
});
