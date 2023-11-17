const {User, Photo, Comment} = require('../models')

class CommentController {
    //get all comments include user and photo
    static async getAllComments(req, res, next) {
        try {
            const comments = await Comment.findAll({
                include: [User, Photo],
              });
              
              const response = comments.map((comment) => {
                return {
                  id: comment.id,
                  comment: comment.comment,
                  UserId: comment.UserId,
                  PhotoId: comment.PhotoId,
                  createdAt: comment.createdAt,
                  updatedAt: comment.updatedAt,
                  Photo: {
                    id: comment.Photo?.id,
                    title: comment.Photo?.title,
                    description: comment.Photo?.description,
                    photo_url: comment.Photo?.photo_url,
                    UserId: comment.Photo?.UserId,
                  },

                  User: {
                    id: comment.User?.id,
                    full_name: comment.User?.full_name,
                    email: comment.User?.email,
                    username: comment.User?.username,
                    profile_img_url: comment.User?.profile_img_url,
                    age: comment.User?.age,
                    phone_number: comment.User?.phone_number,
                  },
                };
              });
              
              res.status(200).json({ comments: response });
        } catch (err) {
            // console.log(err);
            next(err);
        }
    }

    //create comments
    static async createComment(req, res) {
        try {
            const UserId = req.userData.id;
            const { comment, PhotoId } = req.body;
            let data = {
                UserId,
                comment,
                PhotoId,
            };
            const photo = await Photo.findOne({ where: { id: PhotoId } });
            if (!photo) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Photo not found',
                });
            }
            const newComment = await Comment.create(data, { returning: true });
            if (newComment) {
                res.status(201).json({
                    comment: newComment,
                });
            }
        } catch (err) {
      console.error(err);  // Log the error for debugging purposes
      return res.status(401).json({ error: 'Failed to create social media entry' });
        }
    }

    //update comments
    static async updateComment(req, res) {
        try {
            const { comment, PhotoId } = req.body;
            const id = req.params.id;
            let data = {
                comment,
                PhotoId
            };

            const updateComment = await Comment.update(data, { where: { id }, returning: true });
            const response = {
                id: updateComment[1][0].id,
                comment: updateComment[1][0].comment,
                UserId: updateComment[1][0].UserId,
                PhotoId: updateComment[1][0].PhotoId,
                createdAt: updateComment[1][0].createdAt,
                updatedAt: updateComment[1][0].updatedAt,
            }
            if (updateComment) {
                res.status(201).json({
                    comment: response,
                });
            }
        } catch (err) {
            // console.log(err);
            return res.status(401).json(err);
        }
    }

    //delete comments
    static async deleteComment(req, res) {
        try {
            const id = req.params.id;
            const deleteComment = await Comment.destroy({ where: { id } });
            if (deleteComment) {
                res.status(200).json({
                    message: 'Your Comment has been successfully deleted',
                });
            }
        } catch (err) {
            // console.log(err);
            return res.status(401).json(err);
        }
    }
}

module.exports = CommentController;