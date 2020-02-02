import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';

chai.use(chatHttp);
const { expect } = chai;

describe('Testting the book endpoits', ()=>{
    it('It should create a book', (done)=>{
        const book = {
          title: "First Awesome book",
          price: "$9.99",
          description: "This is the awesome book"
        };

        chai.request(app)
        .post('/api/v1/books')
        .set('Accept', 'application/json')
        .send(book)
        .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.data).to.include({
                 id: 1,
          title: book.title,
          price: book.price,
          description: book.description
            });
            done();
        });
    });

    it('should not create a book with incomplete parameters', (done)=>{
        const book = {
            price:'$9.99',
            description:'This is a awesome book'
        }
        chai.request(app)
        .post('/api/v1/books')
        .set('Accept',"application/json")
        .send(book)
        .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
        })


    });

    it('Should get all books', (done)=>{
        chai.request(app)
        .get("/api/v1/books")
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            res.body.data[0].should.have.property('id');
            res.body.data[0].should.have.property("title");
            res.body.data[0].should.have.property("price");
            res.body.data[0].should.have.property("description");
            done();

        })
    });

    it('Should get a particular book', (done)=> {
        const bookId = 1;

        chai.request(app)
        .get(`/api/v1/books/${bookId}`)
        .set('Accept', 'application/json')
        .end((err, res)=>{
            expect(res.status).to.equal(200);
            res.body.data.should.have.property("id");
            res.body.data.should.have.property("title");
            res.body.data.should.have.property("price");
            res.body.data.should.have.property("description");
            done();

        })
    });

    it('It should not get a particular book with invalid id', (done)=>{
        const bookId = 8888;
        chai.request(app)
        .get(`/api/v1/books/${bookId}`)
        .set('Accept','application/json')
        .end((err, res) => {
            expect(res.status).to.equal(400);
            res.body.should.have.property("message")
            .eql(`Cannot find book with the id ${bookId}`);
            done();
        })


    });

    it('It should not get a particular book with invalid non-numeric id', (done)=>{
        const bookId = "aaa";
        chai.request(app)
        .get(`/api/v1/books/${bookId}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            expect(res.status).to.equal(400);
            res.body.should.have.property("message")
            .eql('Please input a valid numeric value');
            done();
        })
    })
})
