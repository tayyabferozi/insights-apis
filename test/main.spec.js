const request = require("supertest");
var expect = require("chai").expect;

const app = require("../app");

describe("Insight APIs", function () {
  it("should send back a JSON array with proper calculated insight objects", function (done) {
    request(app)
      .get("/api/insights/categories")
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }

        const { grouped } = res.body;

        Object.keys(res.body.grouped).forEach((key) => {
          expect(grouped[key]).to.have.property("totalNum").to.exist;
          expect(grouped[key]).to.have.property("totalValue").to.exist;
          expect(grouped[key]).to.have.property("averageValue").to.exist;

          // Check if averageValue is calculated properly

          expect(grouped[key])
            .to.have.property("averageValue")
            .to.equal(grouped[key].totalValue / grouped[key].totalNum);
        });

        done();
      });
  });

  it("should send back a JSON array with proper calculated insight objects", function (done) {
    request(app)
      .get("/api/insights/cashflow")
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }

        const { grouped } = res.body;

        Object.keys(res.body.grouped).forEach((key) => {
          expect(grouped[key]).to.have.property("totalNum").to.exist;
          expect(grouped[key]).to.have.property("totalValue").to.exist;
          expect(grouped[key]).to.have.property("averageValue").to.exist;

          // Check if averageValue is calculated properly

          expect(grouped[key])
            .to.have.property("averageValue")
            .to.equal(grouped[key].totalValue / grouped[key].totalNum);
        });

        done();
      });
  });
});
