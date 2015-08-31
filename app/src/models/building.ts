import {Mapping, Model} from './models'

export class Coords {
    constructor(public lat:number, public lon:number) {}
}

export class Building extends Model {

    public static tableName:string = 'building';

    public static loadFields:string[] = ['title', 'lat', 'lon'];

    public static callback:((el: any) => any) = (el:any) => new Building(el.id, el.title, new Coords(el.lat, el.lon));

    constructor(id:number, public title:string, public coords:Coords) {
        super(id);

        if (this.coords instanceof Array) {
            this.coords = new Coords(coords[0], coords[1]);
        }
    }

    public static loadAll():Promise<Building[]> {
        return super.loadAll<Building>();
    }

    public static load(ids:number[]):Promise<Building[]> {
        return super.load<Building>(ids);
    }

    public static one(id:number):Promise<Building> {
        return super.one<Building>(id);
    }

    public save():Promise<number> {
        return super.save<number>({
            title: this.title,
            lat: this.coords.lat,
            lon: this.coords.lon,
        });
    }
}
