const request = require('supertest')
const app = require('../app')
const { User } = require('../models')
const jwt = require('jsonwebtoken');
let mytoken;

const userData = {
  id: 1,
  full_name: 'joni',
  email: 'joni@example.com',
  username: 'jon',
  password: '123',
  profile_image_url: 'https://example.com/joni.jpg',
  age: 30,
  phone_number: '1234567890',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Register
describe("POST /users/register", () => {
  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error);
    }
  })

  it("Should be response 201 when success", (done) => {
    request(app)
      .post("/users/register")
      .send(userData)
      .expect(201)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body.user).toHaveProperty('full_name', userData.full_name)
        expect(res.body.user).toHaveProperty('email', userData.email)
        expect(res.body.user).toHaveProperty('username', userData.username)
        expect(res.body.user).toHaveProperty('profile_image_url', userData.profile_image_url)
        expect(res.body.user).toHaveProperty('age', userData.age)
        expect(res.body.user).toHaveProperty('phone_number', userData.phone_number)
        done()
      })
  })

  it("Should be response 400 when username is empty", (done) => {
    request(app)
      .post("/users/register")
      .send({
        full_name: userData.full_name,
        email: userData.email,
        username: '',
        password: userData.password,
        profile_image_url: userData.profile_image_url,
        age: userData.age,
        phone_number: userData.phone_number,
      })
      .expect(400)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body).toHaveProperty('message', 'Username is required')
        done()
      })
  })

  it("Should be response 400 when email is empty", (done) => {
    request(app)
      .post("/users/register")
      .send({
        full_name: userData.full_name,
        email: '',
        username: userData.username,
        password: userData.password,
        profile_image_url: userData.profile_image_url,
        age: userData.age,
        phone_number: userData.phone_number,
      })
      .expect(400)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body).toHaveProperty('message', 'Email is required')
        done()
      })
  })

  it("Should be response 400  when invalid URL", (done) => {
    request(app)
      .post("/users/register")
      .send({
        full_name: userData.full_name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        profile_image_url: "htt://gambar.com",
        age: userData.age,
        phone_number: userData.phone_number,
      })
      .expect(400)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body).toHaveProperty('message', 'Invalid URL format')

        done()
      })
  })

  it("Should be response 400  when invalid email", (done) => {
    request(app)
      .post("/users/register")
      .send({
        full_name: userData.full_name,
        email: "joniexample.com",
        username: userData.username,
        password: userData.password,
        profile_image_url: userData.profile_image_url,
        age: userData.age,
        phone_number: userData.phone_number,
      })
      .expect(400)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body).toHaveProperty('message', 'Invalid email format')
        done()
      })
  })

  it("Should be response 400  when email already exists", (done) => {
    request(app)
      .post("/users/register")
      .send({
        full_name: userData.full_name,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        profile_image_url: userData.profile_image_url,
        age: userData.age,
        phone_number: userData.phone_number,
      })
      .expect(400)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body).toHaveProperty('message', 'Email already exists')
        done()
      })
  })
})

// Login
describe("POST /users/login", () => {
  beforeAll(async () => {
    try {
      await User.create(userData)
    } catch (error) {
      console.log(error);
    }
  })

  it("Should be response 200", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: 'joni@example.com',
        password: '123'
      })

      .expect(200)
      .end((err, res) => {
        if (err) done(err)

        res.headers.token = res.body.token
        mytoken = res.headers.token
        expect(res.header).toHaveProperty("token")
        expect(res.body).toHaveProperty("token")
        expect(typeof res.body.token).toEqual("string")

        const decodedToken = jwt.decode(res.body.token, { complete: true });

        expect(decodedToken).toBeDefined();
        expect(decodedToken.header.alg).toEqual('HS256');
        done()
      })
  })

  it("Should be response 404 when password is wrong", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: 'joni@example.com',
        password: '12345'
      })
      .expect(404)
      .end((err, res) => {
        if (err) done(err)

        console.log(res.body)
        expect(res.body).toHaveProperty('message', 'Wrong password')
        done()
      })
  })

  it("Should be response 404 email not found", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: 'j@example.com',
        password: '123'
      })
      .expect(404)
      .end((err, res) => {
        if (err) done(err)

        console.log(res.body)
        expect(res.body).toHaveProperty('message', 'Email not found')
        done()
      })
  })

  it("Should be response 500 server error", (done) => {
    request(app)
      .post("/users/login")
      .send({})
      .expect(500)
      .end((err, res) => {
        if (err) done(err)

        console.log(res.body)
        expect(res.body.message).toEqual('WHERE parameter "email" has invalid "undefined" value')
        done()
      })
  })

  it("Should be response 404 when url not found", (done) => {
    request(app)
      .post("/users/logi")
      .send({
        email: 'joni@example.com',
        password: '123'
      })
      .expect(404)
      .end((err, res) => {
        if (err) done(err)

        console.log(res.body)
        expect(res.body.message).toEqual('Route Not Found')
        done()
      })
   })

  it("Should be response 404 when password is empty", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: 'joni@example.com',
        password: ''
      })
      .expect(404)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body).toHaveProperty('message', 'Password is required')
        done()

      })
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error);
    }
  })
})

// Update
describe("PUT /users/:id", () => {
  beforeAll(async () => {
    try {
      await User.create(userData)
    } catch (error) {
      console.log(error);
    }
  })

  it("Should be response 200 when success", (done) => {
    request(app)
      .put(`/users/${userData.id}`)
      .set("token", `${mytoken}`)
      .send({
        full_name: 'joni',
        email: 'joni@example.com',
        username: 'jon',
        profile_image_url: 'https://example.com/joni.jpg',
        age: 30,
        phone_number: '1234567890',
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err)

        res.headers.token = res.body.token

        expect(res.body.user).toHaveProperty('full_name', 'joni')
        expect(res.body.user).toHaveProperty('email', 'joni@example.com')
        expect(res.body.user).toHaveProperty('username', 'jon')
        expect(res.body.user).toHaveProperty('profile_image_url', 'https://example.com/joni.jpg')
        expect(res.body.user).toHaveProperty('age', 30)
        expect(res.body.user).toHaveProperty('phone_number', '1234567890')
        done()
      })
  })

  it("Should be response 401 when token not found", (done) => {
    request(app)
      .put("/users/1")
      .send({
        full_name: 'joni',
        email: 'joni@example.com',
        username: 'jon',
        profile_image_url: 'https://example.com/joni.jpg',
        age: 30,
        phone_number: '1234567890',
      })
      .expect(401)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body).toHaveProperty('message', 'Auth failed')
        done()
      })
  })

  it("Should be response 404 when user not found", (done) => {
    request(app)
      .put("/users/999")
      .set("token", `${mytoken}`)
      .send({
        full_name: 'joni',
        email: 'joni@example.com',
        username: 'jon',
        profile_image_url: 'https://example.com/joni.jpg',
        age: 30,
        phone_number: '1234567890',
      })
      .expect(404)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body).toHaveProperty('message', 'User not found')
        done()
      })
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error);
    }
  })
})

// Delete
describe("DELETE /users/:id", () => {
  beforeAll(async () => {
    try {
      await User.create(userData)
    } catch (error) {
      console.log(error);
    }
  })

  it("Should be response 200 when success", (done) => {
    request(app)
      .delete(`/users/${userData.id}`)
      .set("token", `${mytoken}`)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)

        res.headers.token = mytoken

        expect(res.body).toHaveProperty('message', 'Your account has been successfully deleted')
        expect(typeof res.headers.token).toBe('string');
        expect(typeof res.body.message).toBe('string');
        expect(res.body.message).toEqual('Your account has been successfully deleted')
        expect(res.statusCode).toEqual(200)
        
        const decodedToken = jwt.decode(mytoken, { complete: true });
        expect(decodedToken.payload.id).toEqual(1)
        done()
      })
  })


  it("Should be response 401 when token not found", (done) => {
    request(app)
      .delete(`/users/${userData.id}`)
      .expect(401)
      .end((err, res) => {
        if (err) done(err)

        expect(res.body).toHaveProperty('message', 'Auth failed')
        expect(typeof res.body.message).toBe('string');
        expect(typeof res.headers.token).toBe('undefined');
        done()
      })
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error);
    }
  })
})
