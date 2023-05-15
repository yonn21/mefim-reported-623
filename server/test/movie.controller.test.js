const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

const listMovie = require("./data/listMovie.json");
const dataMovies = require("./data/movies.json");

// Sử dụng chaiHttp để làm kết nối HTTP
chai.use(chaiHttp);
const expect = chai.expect;

// Định nghĩa test case
describe("get api movies", () => {
  describe("GET /", () => {
    it("should return all movies", (done) => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          // Kiểm tra và xử lý phản hồi từ API
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.deep.equal(listMovie);
          done();
        });
    });

    it("should return movies by primary_title", (done) => {
      let primary_title = "Hố Đen Tử Thần";
      let encodedTitle = encodeURIComponent(primary_title);

      chai
        .request(app)
        .get("/" + encodedTitle)
        .end((err, res) => {
          // Kiểm tra và xử lý phản hồi từ API
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(dataMovies);
          done();
        });
    });

    it("should return movies by primary_title", (done) => {
      let primary_title = "Hố Đen";
      let encodedTitle = encodeURIComponent(primary_title);

      chai
        .request(app)
        .get("/" + encodedTitle)
        .end((err, res) => {
          // Kiểm tra và xử lý phản hồi từ API
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(dataMovies);
          done();
        });
    });
  });
});
