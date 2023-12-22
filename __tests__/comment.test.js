const request = require("supertest");
const app = require("../app");
const { User, Photo, Comment } = require("../models");
let mytoken;

const userData = {
  id: 1,
  full_name: "user",
  email: "user@example.com",
  username: "user",
  password: "123",
  profile_image_url: "https://example.com/user.jpg",
  age: 30,
  phone_number: "123456",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const userData1 = {
  id: 2,
  full_name: "user1",
  email: "user1@example.com",
  username: "user1",
  password: "123",
  profile_image_url: "https://example.com/user1.jpg",
  age: 30,
  phone_number: "123456",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const commentData = {
  id: 1,
  comment: "test",
  PhotoId: 1,
  UserId: 1,
};

const commentData1 = {
  id: 2,
  comment: "test",
  PhotoId: 1,
  UserId: 2,
};

const photoData =
{
    id: 1,
    title: "test",
    caption: "test",
    poster_image_url: "https://example.com/newphoto.jpg",
    UserId: 1,
  }
  const photoData1 =
  {
    id: 2,
    title: "test",
    caption: "test",
    poster_image_url: "https://example.com/newphoto.jpg",
    UserId: 2,
  }

//post comment
describe("POST /comments", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
      await Photo.create(photoData);
      await Comment.create(commentData);
    } catch (error) {
      console.log(error);
    }
  });

  //success response
  it("should send response with 201 status code", (done) => {
    //setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      //execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .post("/comments")
          .set("token", `${mytoken}`)
          .send({
            comment: commentData.comment,
            PhotoId: commentData.PhotoId,
          })
          .expect(201)
          .end((err, res) => {
            if (err) done(err);

            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty("comment");
            expect(res.body.comment).toHaveProperty("PhotoId", 1);
            expect(res.body.comment).toHaveProperty("UserId");
            done();
          });
      });
  });

  //error response (not token)
  it("should send response with 401 status code", (done) => {
    request(app)
      .post("/comments")
      .set("token", "invalid-token")
      .send({
        comment: commentData.comment,
        PhotoId: commentData.PhotoId,
      })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("message", "Auth failed");
        expect(res.body).not.toHaveProperty("comment");
        expect(res.body).not.toHaveProperty("id");
        expect(res.body).not.toHaveProperty("PhotoId");
        expect(res.body).not.toHaveProperty("UserId");
        expect(typeof res.body).toEqual("object");
        done();
      });
  });

  //error response (photoId not found)
  it("should send response with 404 status code", (done) => {
    //setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      //execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .post("/comments")
          .set("token", `${mytoken}`)
          .send({
            comment: commentData.comment,
            PhotoId: 100,
          })
          .expect(404)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).toHaveProperty("status", "failed");
            expect(res.body).not.toHaveProperty("comment");
            expect(res.body).not.toHaveProperty("id");
            expect(res.body).not.toHaveProperty("PhotoId");
            expect(res.body).not.toHaveProperty("UserId");
            expect(typeof res.body).toEqual("object");
            done();
          });
      });
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Photo.destroy({ where: {} });
      await Comment.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

//get comment
describe("GET /comments", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
      await Photo.create(photoData);
      await Comment.create(commentData);
    } catch (error) {
      console.log(error);
    }
  });

  //success response
  it("should send response with 200 status code", (done) => {
    // setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      // execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .get("/comments")
          .set("token", `${mytoken}`)
          .expect(200)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body.comments[0]).toHaveProperty("id");
            expect(res.body.comments[0]).toHaveProperty("comment");
            expect(res.body.comments[0]).toHaveProperty("PhotoId");
            expect(res.body.comments[0]).toHaveProperty("UserId");
            expect(typeof res.body).toEqual("object");
            done();
          });
      });
  });
  //error response
  it("should send response with 401 status code", (done) => {
    // setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      // execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .get("/comments")
          .set("token", "invalid-token")
          .expect(401)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body).toHaveProperty("message", "Auth failed");
            expect(res.body).not.toHaveProperty("comments");
            expect(res.body).not.toHaveProperty("id");
            expect(res.body).not.toHaveProperty("PhotoId");
            expect(res.body).not.toHaveProperty("UserId");
            expect(typeof res.body).toEqual("object");
            done();
          });
      });
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Photo.destroy({ where: {} });
      await Comment.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  }, 5000);
});

describe("PUT /comments/:id", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
      await User.create(userData1);
      await Photo.create(photoData);
      await Comment.create(commentData);
      await Comment.create(commentData1);
    } catch {
      console.log(error);
    }
  });
  //success response
  it("should send response with 200 status code", (done) => {
    // setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      // execute
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .put("/comments/1")
          .set("token", mytoken)
          .send( {comment: "test"} )
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);

            expect(typeof res.body).toEqual("object");
            expect(res.body.comment).toHaveProperty("id");
            expect(res.body.comment).toHaveProperty("comment");
            expect(res.body.comment).toHaveProperty("PhotoId");
            expect(res.body.comment).toHaveProperty("UserId");
            return done();
          });
      });
  });
  //error response (no token)
  it("should send response with 401 status code", (done) => {
    // setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      // execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app).put("/comments/1").send({ comment: "test" })
        .expect(401)
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).toHaveProperty("message", "Auth failed")
          expect(res.body).not.toHaveProperty("comment");
          expect(res.body).not.toHaveProperty("id");
          expect(res.body).not.toHaveProperty("PhotoId");
          expect(res.body).not.toHaveProperty("UserId");
          expect(typeof res.body).toEqual("object");
          done();
        });
      });
  }, 5000);

  //error response (not authorized)
  it("should send response with 401 status code", (done) => {
    request(app)
      .put("/comments/2")
      .send({ comment: "test" })
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("message", "Auth failed");
        expect(res.body).not.toHaveProperty("comment");
        expect(res.body).not.toHaveProperty("id");
        expect(res.body).not.toHaveProperty("PhotoId");
        expect(res.body).not.toHaveProperty("UserId");
        expect(typeof res.body).toEqual("object");
        done();
      });
  });
  //error response (comment not found)
  it("should send response with 404 status code", (done) => {
    // setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      // execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .put("/comments/100")
          .set("token", mytoken)
          .send({ comment: "test" })
          .expect(404)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body).toHaveProperty("message", "Comment not found");
            expect(res.body).not.toHaveProperty("comment");
            expect(res.body).not.toHaveProperty("id");
            expect(res.body).not.toHaveProperty("PhotoId");
            expect(res.body).not.toHaveProperty("UserId");
            expect(typeof res.body).toEqual("object");
            done();
          });
      }, 5000);
  });

  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Photo.destroy({ where: {} });
      await Comment.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

//delete comment
describe("DELETE /comments/:id", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
      await User.create(userData1);
      await Photo.create(photoData);
      await Comment.create(commentData);
      await Comment.create(commentData1);
    } catch {
      console.log(error);
    }
  });
  //success response
  it("should send response with 200 status code", (done) => {
    // setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      // execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .delete("/comments/1")
          .set("token", mytoken)
          .expect(200)
          .end((err, res) => {
            if (err) done(err);

            expect(typeof res.body).toEqual("object");
            expect(res.body).toHaveProperty(
              "message",
              "Your Comment has been successfully deleted"
            );
            done();
          });
      });
  });
  //error response (no token)
  it("should send response with 401 status code", (done) => {
    // setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      // execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .delete("/comments/1")
          .expect(401)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body).toHaveProperty("message", "Auth failed");
            done();
          });
      });
  });

  //error response (Forbidden)
  it("should send response with 403 status code", (done) => {
    // setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      // execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .delete("/comments/2")
          .set("token", mytoken)
          .expect(403)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body).toHaveProperty("message", "Unauthorized");
            expect(typeof res.body).toEqual("object");
            expect(res.body).not.toHaveProperty("status", "success");
            expect(res.body).not.toHaveProperty(
              "message",
              "Your Comment has been successfully deleted"
            );
            done();
          });
      });
  }, 5000);
  //error response (comment not found)
  it("should send response with 404 status code", (done) => {
    // setup
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      // execute
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        res.headers.token = res.body.token;
        mytoken = res.headers.token;

        request(app)
          .delete("/comments/100")
          .set("token", `${mytoken}`)
          .expect(404)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body).toHaveProperty("message", "Comment not found");
            expect(typeof res.body).toEqual("object");
            expect(res.body).not.toHaveProperty("status", "success");
            expect(res.body).not.toHaveProperty(
              "message",
              "Your Comment has been successfully deleted"
            );
            done();
          });
      });
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Photo.destroy({ where: {} });
      await Comment.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});
