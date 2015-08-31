import {Book, Author} from './models/test'

Author.one(1).then((author:Author) => {
    author.getBooks().then((books:Book[]) => {
        console.log(books);
    });
});