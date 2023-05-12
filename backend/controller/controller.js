const movieModel = require("../model/model");

module.exports = {
  saveMovie: async (req, res, next) => {
    try {
      if (req.file) {
        const file = req.file;
        const data = req.body;

        if (
          data.title == "" ||
          data.description == "" ||
          data.duration == "" ||
          data.genre == ""
        ) {
          return res.send({
            success: false,
            message: "Fill up all the field",
          });
        }

        const duration = data.duration;
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        let formattedDuration = `${hours} hr`;
        if (minutes > 0) {
          formattedDuration += ` ${minutes} min`;
        }

        data.duration = formattedDuration;

        // data.image = file.filename
        const url = req.protocol + "://" + req.get("host");

        data.image = url + "/" + file.filename;

        const movieExist = movieModel.find({ title: data.title });
        if (movieExist.length < 0) {
          return res.send({
            success: false,
            message: "Movie already Exist",
          });
        }

        const newMovie = new movieModel(data);
        await newMovie.save();

        res.send({
          success: true,
          message: "Movie added",
        });
      } else {
        res.send({
          success: false,
          message: "Fill up all fields",
        });
      }
    } catch (error) {
      res.send({
        success: false,
        message: "something went wrong",
      });
    }
  },

  fetchMovies: async (req, res, next) => {
    try {
      const documents = await movieModel.aggregate([
        {
          $group: {
            _id: "$genre",
            documents: { $push: "$$ROOT" },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

      if (documents.length == 0) {
        return res.send({
          success: false,
          message: "No movies",
        });
      }

      res.send({
        success: true,
        message: "Movies fetched",
        data: documents,
      });
    } catch (error) {
      res.send({
        success: false,
        message: "something went wrong",
      });
    }
  },

  getAllMovies: async (req, res, next) => {
    try {
      const documents = await movieModel.find({});
      res.send({
        success: true,
        message: "All documents fetched",
        data: documents,
      });
    } catch (error) {
      res.send({
        success: false,
        message: "something went wrong",
      });
    }
  },

  getDetails: async (req, res, next) => {
    try {
      const title = req.body.title;

      const document = await movieModel.find({ title: title });

      res.send({
        success: true,
        message: "movie details fetched successfully",
        data: document,
      });
    } catch (error) {
      res.send({
        success: false,
        message: "something went wrong",
      });
    }
  },

  editMovie: async (req, res, next) => {
    try {
      const data = req.body;

      const movieExist = await movieModel.find({ title: data.title });
      if (movieExist.length > 0) {
        return res.send({
          success: false,
          message: "Movie name already exist",
        });
      }
      await movieModel.findByIdAndUpdate(
        { _id: data._id },
        {
          $set: {
            title: data.title,
            description: data.description,
            duration: data.duration,
            genre: data.genre,
          },
        }
      );
      console.log("data edited");
      res.send({
        success: true,
        message: "data edited",
      });
    } catch (error) {
      res.send({
        success: false,
        message: "something went wrong",
      });
    }
  },

  editMovieWithFile: async (req, res, next) => {
    try {
      const data = req.body;
      const url = req.protocol + "://" + req.get("host");

      data.image = url + "/" + req.file.filename;

      const movieExist = await movieModel.find({ title: data.title });
      if (movieExist.length > 0) {
        return res.send({
          success: false,
          message: "Movie name already exist",
        });
      }

      await movieModel.findByIdAndUpdate(
        { _id: data._id },
        {
          $set: {
            title: data.title,
            description: data.description,
            duration: data.duration,
            genre: data.genre,
            image: data.image,
          },
        }
      );

      res.send({
        success: true,
        message: "Movie data Edited",
      });
    } catch (error) {
      res.send({
        success: false,
        message: "something went wrong",
      });
    }
  },
  deleteMovie: async (req, res, next) => {
    try {
      const data = req.body;
      await movieModel.deleteOne({ title: data.title });

      res.send({
        success: true,
        message: "Movie is deleted",
      });
    } catch (error) {
      res.send({
        success: false,
        message: "something went wrong",
      });
    }
  },
};
