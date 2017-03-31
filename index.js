import Dexie from 'dexie';
import 'dexie-observable';

//import * as gitModes        from 'js-git/lib/modes';
import * as gitIndexedDb    from 'js-git/mixins/indexed-db';
//import * as gitMemDb        from 'js-git/mixins/mem-db';
import * as gitCreateTree   from 'js-git/mixins/create-tree';
//import * as gitPackOps      from 'js-git/mixins/pack-ops';
//import * as gitWalkers      from 'js-git/mixins/walkers';
//import * as gitReadCombiner from 'js-git/mixins/read-combiner';
import * as gitFormats      from 'js-git/mixins/formats';

import { Element } from './models';

export class GitDexie extends Dexie {
  constructor (name, options) {
    super(name, options);

    this.version(1).stores({
      elements: '[hash+id], id, hash, [id+state], state, name, description, shortname, owner, group, modified',
      objects: 'hash',
      refs: 'path',
    });

    this.elements.mapToClass(Element);

    let repo = {};

    gitIndexedDb(repo, 'test');
    gitIndexedDb.db = this.backendDB();
    gitCreateTree(repo);
    gitFormats(repo);

    this.repo = repo;
  }

  initialize() {
    // create new project space
  }
  
  async gitAdd(...objects) {
    for (let object of objects) {
      //await this.elements.where({ id: object.id, state: 1 }).modify({ state: 0 });
      await this.elements.update(object.pk, { state: 1 });
    }
    // add file to the index
  }
  
  async gitStatus() {
    // return status of index
    // compare index to HEAD
    // compare work tree to index
    // X        Y
    // ''       [MD]  '' not updated 
    // M       [ MD]  updated in index
    // A       [ MD]  added to index
    // D        [ M]  deleted from index
    // R       [ MD]  renamed in index
    // C       [ MD]  copied in index
    // [MARC]         index and work tree matches
    // [ MARC]  M     work tree changed since index
    // [ MARC]  D     deleted in work tree
    console.log(await this.gitDiffFiles())
  }
  
  async gitDiffIndex(hash, cached=true) {
    // cached? compares the tree<hash> and index
    // else compare the work tree and the index
  }
  
  async gitDiffTree(hash1, hash2) {
    // compare the two trees
  }
  
  async gitDiffFiles() {
    // compare the index the work tree
    let index = await this.elements.where('state').equals(1).toArray();
    let work =  await this.elements.where('state').equals(0).toArray();
  
    console.log('i', index, 'w', work);
  }
  
  async gitCommit() {
    let repo = this.repo;
    let index = await this.elements.where('state').equals(1).toArray();
  
    console.log('to be committed', index);
  }
}
