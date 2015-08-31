import {db} from './db'

export function $(arg) {
    console.log(arg);
    db.end();
    process.exit(0);
}

export class ModelMapping {
    constructor(public type:Mapping, public model:Function, public field:string, public callback:Function) {}
}

export enum Mapping {
    oneToOne,
    manyToOne,
    oneToMany,
    manyToMany
}

export class Model {

    public id:number;

    public static tableName:string = null;

    public static loadFields:string[] = null;

    public static callback:(el: any) => any = null;

    public static mappings:{} = {};

    public static getLoadFields() {
        return ['id', ...this.loadFields].filter((el) => el != void 0)
    }

    public static map(type:Mapping, mappings: {}) {
        for (var field in mappings) {
            if ( ! mappings.hasOwnProperty(field)) continue;

            var model = mappings[field];
            var modelField:string = field.replace(/_id$/, '');
            switch (type) {
                case Mapping.manyToOne:
                    this.mappings[modelField] = new ModelMapping(type, model, field, function () {
                        var fields:string[] = model['getLoadFields']();
                        var q = `SELECT ${fields.join(', ')} FROM ${model.tableName} WHERE id = ${this[field]}`;
                        return db.query(q).then((data):any => {
                                var fieldsData = {};

                                fields.forEach((el) => {
                                    fieldsData[el] = data[0][0][el];
                                });

                                return new model(fieldsData);
                            });
                    });
                    break;
                case Mapping.oneToMany:
                    this.mappings[modelField] = new ModelMapping(type, model, field, function () {
                        var fields:string[] = model['getLoadFields']();
                        var q = `SELECT ${fields.join(', ')} FROM ${model.tableName} WHERE ${field} = ${this.id}`;

                        return db.query(q).then((data):any => {
                            var result = [];
                            data[0].forEach((row) => {
                                var fieldsData = {};
                                fields.forEach((el) => {
                                    fieldsData[el] = row[el];
                                });
                                result.push(new model(fieldsData));
                            });

                            return result;
                        });
                    });
                    break;
            }
        }
    }

    public manyToOne(mappings:{}) {
        return this.map(Mapping.manyToOne, mappings);
    }

    public oneToMany(mappings:{}) {
        return this.map(Mapping.oneToMany, mappings);
    }

    constructor(fields:{});
    constructor(id:any) {
        if (typeof id === 'object') {
            this.id = id.id;
        } else {
            this.id = id;
        }
    }

    public static loadAll<R>(cb:(el:any) => R = this.callback):Promise<R[]> {
        var fields = this.getLoadFields();
        return db.query(`SELECT ${fields} FROM ${this.tableName}`)
            .then((data:any) => {
                var result:R[] = [];

                data[0].forEach(function (el:any) {
                    result.push(cb(el));
                });

                return result;
            });
    }

    public static load<R>(ids:number[], cb:(el:any) => R = this.callback):Promise<R[]> {
        var fields = this.getLoadFields();
        return db.query(`SELECT ${fields} FROM ${this.tableName} WHERE ${this.tableName}.id IN (${ids.join(',')})`)
            .then((data:any) => {
                var result:R[] = [];

                data[0].forEach(function (el:any) {
                    result.push(cb(el));
                });

                return result;
            });
    }

    public static one<R>(id:number, cb:(el:any) => R = this.callback):Promise<R> {
        var fields = this.getLoadFields();
        var q = `SELECT ${fields} FROM ${this.tableName} WHERE ${this.tableName}.id = ${id}`;

        return db.query(q)
            .then((data:any) => {
                data = data[0];
                if (data.length > 0)
                    return cb(data[0]);

                return null;
            });
    }

    public save<R>(fields:any):Promise<number> {
        var tableName = this.constructor['tableName'];
        if (this.id) {
            fields = ((obj) => {
                var result = [];
                for (var p in obj) {
                    if ( ! obj.hasOwnProperty(p) || p == 'id') continue;
                    result.push(`${p} = "${obj[p].toString().replace(/["\\]/g, '\\$&')}"`);
                }
                return result.join(',');
            })(fields);
            return db.query(`UPDATE ${tableName} SET ${fields} WHERE id = ${this.id}`)
                .then(() => this.id);
        }

        var values = (() => {
            var result = [];
            for (var p in fields) {
                if ( ! fields.hasOwnProperty(p) || p == 'id') continue;
                result.push(`"${fields[p].toString().replace(/["\\]/g, '\\$&')}"`);
            }
            return result;
        })();

        return db.query(`INSERT INTO ${tableName} (${Object.keys(fields)}) VALUES(${values.join(',')})`)
            .then(function (data) {
                return data[0].insertId;
            });
    }
}
