const db = require('../database/models');
const sequelize = db.sequelize;


const genresController = {
    'list': (req, res) => {
        db.Genre.findAll({
            include:['movies']
        })
            .then(genres => {
                /* return res.send(genres) */
                return res.render('genresList', {genres})
            })
    },
    'detail': (req, res) => {
        db.Genre.findByPk(req.params.id)
            .then(genre => {
                res.render('genresDetail', {genre});
            });
    }

}

module.exports = genresController;