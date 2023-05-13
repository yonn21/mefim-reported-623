const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

// Sử dụng chaiHttp để làm kết nối HTTP
chai.use(chaiHttp);
const expect = chai.expect;

// Định nghĩa test case
describe('Movie API', () => {
  describe('GET /movies', () => {
    it('should return all movies', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          // Kiểm tra và xử lý phản hồi từ API
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.deep.equal(expectedMovies);
          done();
        });
    });
  });
});