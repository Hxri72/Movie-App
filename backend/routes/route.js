const router = require('express').Router();
const controller = require('../controller/controller');
const {upload} = require("../multer/multer");

router.post('/addMovie',upload.single('image'),controller.saveMovie)   

router.get('/fetchMovies',controller.fetchMovies)

router.get('/getAllMovies',controller.getAllMovies)

router.post('/getDetails',controller.getDetails)

router.post('/editMovie',controller.editMovie)

router.post('/deleteMovie',controller.deleteMovie)

router.post('/editMovieWithFile',upload.single('image'),controller.editMovieWithFile)


module.exports = router;