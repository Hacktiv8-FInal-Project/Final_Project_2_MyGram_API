const request = require("supertest");
const app = require("../app");
const { User, Photo } = require("../models");
const jwt = require("jsonwebtoken");
let myToken;

const userData = {
  id: 1,
  full_name: "joni",
  email: "joni@example.com",
  username: "jon",
  password: "123",
  profile_image_url: "https://example.com/joni.jpg",
  age: 30,
  phone_number: "1234567890",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const photoData = {
  id: 1,
  title: "New Photo",
  caption: "Photo Caption",
  poster_image_url: "https://example.com/newphoto.jpg",
};
describe("POST /users/register", () => {
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });

  it("Should be response 201 when success", (done) => {
    request(app)
      .post("/users/register")
      .send(userData)
      .expect(201)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body.user).toHaveProperty("full_name", userData.full_name);
        expect(res.body.user).toHaveProperty("email", userData.email);
        expect(res.body.user).toHaveProperty("username", userData.username);
        expect(res.body.user).toHaveProperty(
          "profile_image_url",
          userData.profile_image_url
        );
        expect(res.body.user).toHaveProperty("age", userData.age);
        expect(res.body.user).toHaveProperty(
          "phone_number",
          userData.phone_number
        );
        done();
      });
  });
});

describe("POST /users/login", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
    } catch (error) {
      console.log(error);
    }
  });

  it("Should be response 200", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: "joni@example.com",
        password: "123",
      })

      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        myToken = res.headers.token;
        expect(res.header).toHaveProperty("token");
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toEqual("string");

        const decodedToken = jwt.decode(res.body.token, { complete: true });

        expect(decodedToken).toBeDefined();
        expect(decodedToken.header.alg).toEqual("HS256");
        done();
      });
  });
});

//create
describe("POST /photos", () => {
  afterAll(async () => {
    await Photo.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it("Should be response 201", (done) => {
    request(app)
      .post("/photos")
      .set("token", `${myToken}`)
      .send(photoData)
      .expect(201)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("title", photoData.title);
        expect(res.body).toHaveProperty("caption", photoData.caption);
        expect(res.body).toHaveProperty(
          "poster_image_url",
          photoData.poster_image_url
        );
        done();
      });
  });

  it("Title is Required", (done) => {
    request(app)
      .post("/photos")
      .set("token", `${myToken}`)
      .send({
        title: "",
        caption: photoData.caption,
        poster_image_url: photoData.poster_image_url,
      })
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body).toHaveProperty(
            "message",
            "Validation error: Title is required"
          );
          done();
        }
      });
  });

  it("Caption is Required", (done) => {
    request(app)
      .post("/photos")
      .set("token", `${myToken}`)
      .send({
        title: photoData.title,
        caption: "",
        poster_image_url: photoData.poster_image_url,
      })
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.body).toHaveProperty(
            "message",
            "Validation error: Caption is required"
          );
          done();
        }
      });
  });

  it("Should be response 401", (done) => {
    request(app)
      .post("/photos")
      .send(photoData)
      .expect(401)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toHaveProperty("message", "Auth failed");
        done();
      });
  });

  it("Should be response 404", (done) => {
    request(app)
      .post("/photoss")
      .set("token", `${myToken}`)
      .send(photoData)
      .expect(404)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toHaveProperty("message", "Route Not Found");
        done();
      });
  });
});

//create
describe("GET /photos", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
      await Photo.create(photoData);
    } catch (error) {
      console.log(error);
    }
  });

  it("Should be response 200", (done) => {
    request(app)
      .get("/photos")
      .set("token", `${myToken}`)
      .expect(200)
      .timeout(10000)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toBeInstanceOf(Array);
        done();
      });
  });

  it("Should be response 401", (done) => {
    request(app)
      .get("/photos")
      .expect(401)
      .timeout(10000)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toHaveProperty("message", "Auth failed");
        done();
      });
  });

  it("Should be response 404", (done) => {
    request(app)
      .get("/photoss")
      .set("token", `${myToken}`)
      .expect(404)
      .timeout(10000)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toHaveProperty("message", "Route Not Found");
        done();
      });
  });
});

//edit
describe("PUT /photos/:id", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
      await Photo.create(photoData);
    } catch (error) {
      console.log(error);
    }
  });

  it("Should be response 200", (done) => {
    console.log(photoData.id);
    request(app)
      .put(`/photos/${photoData.id}`)
      .set("token", `${myToken}`)
      .send({
        title: "aku cinta dia",
        caption: "cobalah mengerti",
        poster_image_url: "https://example.com/newphoto.png",
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toHaveProperty("id");
        expect(res.body.Photo).toHaveProperty("title", "aku cinta dia");
        expect(res.body.Photo).toHaveProperty("caption", "cobalah mengerti");
        expect(res.body.Photo).toHaveProperty(
          "poster_image_url",
          "https://example.com/newphoto.png"
        );

        done();
      });
  });

  it("Should be response 404", (done) => {
    request(app)
      .put(`/photoss/${photoData.id}`)
      .set("token", `${myToken}`)
      .send({
        title: "aku cinta dia",
        caption: "cobalah mengerti",
        poster_image_url: "https://example.com/newphoto.png",
      })
      .expect(404)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("message", "Route Not Found");
        done();
      });
  });

  it("Should be response 401", (done) => {
    request(app)
      .put(`/photos/${photoData.id}`)
      .send({
        title: "aku cinta dia",
        caption: "cobalah mengerti",
        poster_image_url: "https://example.com/newphoto.png",
      })
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("message", "Auth failed");
        done();
      });
  });
});

// delete
describe("DELETE /photos/:id", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
      await Photo.create(photoData);
    } catch (error) {
      console.log(error);
    }
  });

  it("Should be response 200", (done) => {
    request(app)
      .put(`/photos/${photoData.id}`)
      .set("token", `${myToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        done();
      });
  });

  it("Should be response 404", (done) => {
    request(app)
      .delete(`/photoss/${photoData.id}`)
      .set("token", `${myToken}`)
      .expect(404)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("message", "Route Not Found");
        done();
      });
  });

  it("Should be response 401", (done) => {
    request(app)
      .delete(`/photos/${photoData.id}`)
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("message", "Auth failed");
        done();
      });
  });
});
