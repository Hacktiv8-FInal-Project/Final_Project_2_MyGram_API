const request = require("supertest");
const app = require("../app");
const { User, SocialMedia } = require("../models");
let mytoken;

const userData = {
  id: 1,
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
const userData1 = {
  id: 2,
  full_name: "user2",
  email: "user2@example.com",
  username: "user2",
  password: "123",
  profile_image_url: "https://example.com/user2.jpg",
  age: 30,
  phone_number: "123456",
};

const SocialMediaData = {
  id: 1,
  name: "instagram",
  social_media_url: "https://www.instagram.com/instagram/",
  UserId: 1,
};
const SocialMediaData1 = {
  id: 2,
  name: "facebook",
  social_media_url: "https://www.facebook.com/facebook/",
  UserId: 2,
};

//create socialmedia
describe("POST /socialmedias", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
      await SocialMedia.create(SocialMediaData);
    } catch {
      console.log(error);
    }
  });

  //success response
  it("should send response with 200", (done) => {
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
          .post("/socialmedias")
          .set("token", `${mytoken}`)
          .send({
            name: "instagram",
            social_media_url: "https://www.instagram.com/instagram/",
          })
          .expect(201)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body.social_media).toHaveProperty(
              "UserId",
              expect.any(Number)
            );
            expect(res.body.social_media).toHaveProperty(
              "name",
              SocialMediaData.name
            );
            expect(res.body.social_media).toHaveProperty(
              "social_media_url",
              SocialMediaData.social_media_url
            );
            done();
          });
      });
  });

  //error response (no token)
  it("should send response with 401 when token not found", (done) => {
    request(app)
      .post("/socialmedias")
      .send({
        name: "instagram",
        social_media_url: "https://www.instagram.com/instagram/",
      })
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty("message", "Auth failed");
        expect(typeof res.body).toEqual("object");
        expect(res.body).not.toHaveProperty("id", expect.any(Number));
        expect(res.body).not.toHaveProperty("UserId", expect.any(Number));
        expect(res.body).not.toHaveProperty("name", SocialMediaData.name);
        expect(res.body).not.toHaveProperty(
          "social_media_url",
          SocialMediaData.social_media_url
        );
        done();
      });
  });

  //error response ( invalid url)
  it("should send response with 401 when invalid URL", (done) => {
    request(app)
      .post("/socialmedias")
      .set("token", `${mytoken}`)
      .send({
        name: "instagram",
        social_media_url: "instagram",
      })
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        expect(res.statusCode).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body).not.toHaveProperty("id", expect.any(Number));
        expect(res.body).not.toHaveProperty("UserId", expect.any(Number));
        expect(res.body).not.toHaveProperty("name", SocialMediaData.name);
        expect(res.body).not.toHaveProperty(
          "social_media_url",
          SocialMediaData.social_media_url
        );
        done();
      });
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

//get socialmedia
describe("GET /socialmedias", () => {
  beforeAll(async () => {
    try {
      await User.create(userData);
      await SocialMedia.create(SocialMediaData);
    } catch {
      console.log(error);
    }
  });
  //success response
  it("should send response with 200", (done) => {
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

        // setup
        request(app)
          .post("/socialmedias")
          .set("token", `${mytoken}`)
          .send({
            name: "instagram",
            social_media_url: "https://www.instagram.com/instagram/",
          })
          // execute
          .expect(201)
          .end((err) => {
            if (err) return done(err);

            // setup
            request(app)
              .get("/socialmedias")
              .set("token", `${mytoken}`)
              // execute
              .end((err, res) => {
                if (err) return done(err);

                // assertions for the GET request
                expect(res.body).toBeInstanceOf(Object);
                expect(res.body).not.toBeInstanceOf(Array);

                // Call done only once, after all assertions are completed
                done();
              });
          });
      });
  });

  // Test case untuk menanggapi ketika tidak ada data sosial media ditemukan
  it("should send response with 404 when no social media found", (done) => {
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
        
        SocialMedia.destroy({ where: {} }).then(() => {
          // setup: GET request ke /socialmedias
          request(app)
            .get("/socialmedias")
            .set("token", `${mytoken}`)
            // execute
            .end((err, res) => {
              if (err) done(err);

              expect(typeof res.body).toEqual("object");
              expect(res.body).toHaveProperty("social_medias", []);
              done();
            });
        });
      }, 10000);
  });

  //error response (no token)
  it("should send response with 401 when token not found", (done) => {
    request(app)
      .get("/socialmedias")
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body).toHaveProperty("message", "Auth failed");
        expect(typeof res.body).toEqual("object");
        expect(res.body).not.toHaveProperty("id", expect.any(Number));
        done();
      });
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

//edit socialmedia
describe("PUT /socialmedias/:id", () => {
  beforeAll(async () => {
    try {
      const result = await User.create(userData);
      await User.create(userData1);
      await SocialMedia.create({ ...SocialMediaData, UserId: result.id });
      await SocialMedia.create(SocialMediaData1);
    } catch {
      console.log(error);
    }
  });

  // Test case untuk berhasil mengupdate social media
  it("should successfully update social media with 200 status", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        mytoken = res.body.token;

        request(app)
          .put(`/socialmedias/${SocialMediaData.id}`)
          .set("token", mytoken)
          .send({
            name: "instagram",
            social_media_url: "https://www.instagram.com/instagram/",
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            const updatedSocialMedia = res.body.social_medias;

            expect(updatedSocialMedia).toHaveProperty("name", "instagram");
            expect(updatedSocialMedia).toHaveProperty(
              "social_media_url",
              "https://www.instagram.com/instagram/"
            );

            done();
          });
      });
  });

  // Test case untuk menghandle situasi ketika token tidak valid
  it("should handle invalid token with 401 status", (done) => {
    request(app)
      .put(`/socialmedias/${SocialMediaData.id}`)
      .set("token", "invalid-token")
      .send({
        name: "UpdatedSocialMediaName",
        social_media_url: "https://www.updated-example.com",
      })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("message", "Auth failed");

        done();
      });
  }, 10000);

  // Test case untuk menghandle situasi ketika social media tidak ditemukan
  it("should handle not found with 404 status", (done) => {
    request(app)
      .put("/socialmedias/999")
      .set("token", mytoken)
      .send({
        name: "UpdatedSocialMediaName",
        social_media_url: "https://www.updated-example.com",
      })
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        // Pastikan respons sesuai dengan yang diharapkan untuk social media tidak ditemukan
        expect(res.body).toHaveProperty("message", "Social Media not found");

        done();
      });
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

// delete socialmedia
describe("DELETE /socialmedias/:id", () => {
  beforeAll(async () => {
    try {
      const result = await User.create(userData);
      await User.create(userData1);
      await SocialMedia.create({ ...SocialMediaData, UserId: result.id });
      await SocialMedia.create(SocialMediaData1);
    } catch {
      console.log(error);
    }
  });

  //success response
  it("should send response with 200", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        mytoken = res.body.token;

        request(app)
          .delete(`/socialmedias/${SocialMediaData.id}`)
          .set("token", mytoken)
          .expect(200)
          .end((err, res) => {
            if (err) done(err);

            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty(
              "message",
              "Your social media has been successfully deleted"
            );
            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty(
              "message",
              "Your social media has been successfully deleted"
            );
            done();
          });
      }, 10000);
  });

  //error response (Unauthorized)
  it("should send response with 401", (done) => {
    request(app)
      .delete(`/socialmedias/${SocialMediaData.id}`)
      .set("token", "invalid-token")
      .expect(401)
      .end((err, res) => {
        if (err) done(err);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty("message", "Auth failed");
        expect(typeof res.body).toEqual("object");
        expect(res.body).not.toHaveProperty(
          "message",
          "Your social media has been successfully deleted"
        );
        expect(res.body).not.toHaveProperty("status", "success");
        done();
      });
  });

  //error response (Not Found)
  it("should send response with 401", (done) => {
    request(app)
      .delete(`/socialmedias/${SocialMediaData.id}`)
      .set("token", mytoken)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty("message", "Social Media not found");
        expect(typeof res.body).toEqual("object");
        expect(res.body).not.toHaveProperty(
          "message",
          "Your social media has been successfully deleted"
        );
        expect(res.body).not.toHaveProperty("status", "success");
        return done();
      });
  });

  //error response (not found)
  it("should send response with 404", (done) => {
    request(app)
      .delete("/socialmedias/100")
      .set("token", mytoken)
      .expect(404)
      .end((err, res) => {
        if (err) done(err);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("message", "Social Media not found");
        expect(typeof res.body).toEqual("object");
        expect(res.body).not.toHaveProperty(
          "message",
          "Your social media has been successfully deleted"
        );
        expect(res.body).not.toHaveProperty("status", "success");
        done();
      });
  }, 10000);

  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});