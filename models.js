import Dexie from 'dexie';
Dexie.Promise = Promise;
import * as sha1 from 'js-sha1';

export function hashObject(type, body) {
  let object = `${ type } ${ body.length }\0${ body }`;
  return sha1(object);
}

const storedProps = ['parent', 'name', 'description'];

export class Element {
  constructor(name, description) {
    this.id = Dexie.Observable.createUUID();
    this.name = name;
    this.state = 0;
    this.description = description;
    this.updateHash();
    this.modified = new Date();
    this.created = new Date();
  }

  updateHash() {
    return this.hash = hashObject('blob', this.toString());
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toJSON() {
    let obj = {};
    for (let prop of storedProps) {
      obj[prop] = this[prop];
    }
    return obj;
  }

  get pk() {
    return [this.hash, this.id];
  }
}
