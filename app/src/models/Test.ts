import {Mapping, Model, $} from './models'

export class Book extends Model {

    public static tableName:string = 'book';

    public static loadFields:string[] = ['title', 'author_id'];

    public static callback:((el:any) => any) = (el:any) => new Book(el.id, el.title, el.author_id);

    public author:Promise<Author>;

    public getAuthor():Promise<Author> {
        return Book.mappings['author'].callback.call(this);
    }

    constructor(id:any, public title:string, public author_id:number) {
        super(id);
        if (typeof id === 'object') {
            this.title = id.title;
            this.author_id = id.author_id;
        } else {
            this.title = title;
            this.author_id = author_id;
        }
    }

    public static loadAll():Promise<Book[]> {
        return super.loadAll<Book>();
    }

    public static load(ids:number[]):Promise<Book[]> {
        return super.load<Book>(ids);
    }

    public static one(id:number):Promise<Book> {
        return super.one<Book>(id);
    }

    public save():Promise<number> {
        return super.save<number>({
            title: this.title,
            author_id: null
        });
    }
}

export class Author extends Model {

    public static tableName:string = 'author';

    public static loadFields:string[] = ['name'];

    public static callback:((el:any) => any) = (el:any) => new Author(el.id, el.name);

    public getBooks():Promise<Book[]> {
        return Author.mappings['author'].callback.call(this);
    }

    constructor(id:any, public name:string) {
        super(id);
        if (typeof id === 'object') {
            this.name = id.name;
        } else {
            this.name = name;
        }
    }

    public static one(id:number):Promise<Author> {
        return super.one<Author>(id);
    }

}

Book.manyToOne({author_id: Author});
Author.oneToMany({author_id: Book});
