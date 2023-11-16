const { Photo } = require("../models");
const { User } = require("../models");

class PhotoController {
  //  post photos
  static async postPhoto(req, res) {
    try {
      const { title, caption, poster_image_url } = req.body;
      const UserId = req.userData.id;
      console.log(req.body);
      console.log("UserId saya : ", UserId);

      const photo = await Photo.create({
        title,
        caption,
        poster_image_url,
        UserId,
      });

      //   handle menyembunyikan CreatedAt dan UpdatedAt
      const responseData = {
        id: photo.id,
        title: photo.title,
        caption: photo.caption,
        poster_image_url: photo.poster_image_url,
        UserId: photo.UserId,
      };

      res.status(201).json(responseData);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //  get photos
  static async getPhotos(req, res) {
    try {
      const photos = await Photo.findAll({
        include: {
          model: User,
          attributes: ["id", "username", "profile_image_url"],
        },
      });

      res.json(photos);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //  update photos
  static async updatePhoto(req, res) {
    try {
      const { id } = req.params;
      const { title, caption, poster_image_url } = req.body;

      const [count, [updatedPhoto]] = await Photo.update(
        {
          title,
          caption,
          poster_image_url,
        },
        {
          where: {
            id: id,
          },
          returning: true,
        }
      );

      if (count === 0) {
        res.status(404).json({
          message: "Photo not found",
        });
      } else {
        res.status(200).json({
          photo: updatedPhoto,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  //  delete photos
  static async deletePhoto(req, res) {
    try {
      const { id } = req.params;

      const deletedPhoto = await Photo.destroy({
        where: {
          id: id,
        },
      });

      if (deletedPhoto === 0) {
        res.status(404).json({
          message: "Photo not found",
        });
      }

      res.status(200).json({
        message: "Your Photo has been successfully deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = PhotoController;
