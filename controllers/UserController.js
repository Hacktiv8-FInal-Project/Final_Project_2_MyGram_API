const {
  User
} = require("../models")

const {
  generateToken
} = require("../utils/jwt")

const {
  comparePassword
} = require("../utils/bcrypt")

class UserController {
  static async register(req, res) {
    try {
      const {
        full_name,
        email,
        username,
        password,
        profile_image_url,
        age,
        phone_number,
      } = req.body

      const user = await User.create({
        email,
        full_name,
        username,
        password,
        profile_image_url,
        age,
        phone_number,
      })

      res.status(201).json({
        user: {
          email: user.email,
          full_name: user.full_name,
          username: user.username,
          profile_image_url: user.profile_image_url,
          age: user.age,
          phone_number: user.phone_number,
        }
      })
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        res.status(404).json({
          message: "Email not found"
        })
      }

      const checkPassword = comparePassword(password, user.password)

      if (!checkPassword) {
        res.status(404).json({
          message: "Wrong password"
        })
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        profile_image_url: user.profile_image_url,
        age: user.age,
        phone_number: user.phone_number,
      })

      res.status(200).json({
        token
      })
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params
      const {
        email,
        full_name,
        username,
        profile_image_url,
        age,
        phone_number,
      } = req.body;

      const [count, [updatedUser]] = await User.update(
        {
          email,
          full_name,
          username,
          profile_image_url,
          age,
          phone_number,
        },
        {
          where: {
            id
          },
          returning: true,
        },
      )

      if (count === 0) {
        res.status(404).json({
          message: "User not found"
        });
      } else {
        res.status(200).json({
          user: {
            email: updatedUser.email,
            full_name: updatedUser.full_name,
            username: updatedUser.username,
            profile_image_url: updatedUser.profile_image_url,
            age: updatedUser.age,
            phone_number: updatedUser.phone_number,
          }
        });
      }

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params

      const deletedUser = await User.destroy({
        where: {
          id: id
        }
      })

      if (deletedUser === 0) {
        res.status(404).json({
          message: "User not found"
        })
      }

      res.status(200).json({
        message: "Your account has been successfully deleted"
      })
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
}

module.exports = UserController