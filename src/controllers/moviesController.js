const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const { error } = require('console');

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: (req, res) => {
        db.Movie.findAll(
            {
                include:['genre']
            }
        )
            .then(movies => {
             
                res.render('moviesList.ejs', {movies})
            })
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie,moment});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {    
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order:['name']
        })
            .then(allGenres=>{
                res.render('moviesAdd',{
                allGenres})
            })
            .catch(error=>console.log(error))
    },
    create: function (req,res) {
        const {
            title,
            rating,
            release_date,
            awards,
            length,
            genre_id
        } = req.body

        const actors=[req.body.actors].flat()
        db.Movie.create({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length,
            genre_id,
        }).then(movie => {
            if(actors){
                const actorsDB= actors.map(actor=>{
                    return {
                        movie_id:movie.id,
                        actor_id:actor
                    }   
                })
                db.Actor_Movie.bulkCreate(actorsDB,{
                    validate:true
                }).then(()=>{
                        console.log('actores agregados')
                        return res.redirect('/movies')
                    })
            }
            console.log(movie);
            
        })
    },
    edit: function(req,res) {

        const genres=db.Genre.findAll({
            order:['name']
        });
        const movie=db.Movie.findByPk(req.params.id,{
            include:['actors']
        })
        const actors= db.Actor.findAll({
            order:[ ['first_name','ASC'],['last_name','ASC']]
        });


        Promise.all([genres,movie,actors])
            .then(([genres,movie,actors]) => {
               /* return res.send(movie) */
                return res.render('moviesEdit', {
                    actors,
                    genres,
                    movie,
                    moment
                })
            })
            .catch(error => console.log(error))
    },
    update: function (req,res) {
        let {title,awards,rating,length,release_date,genre_id,actors}=req.body
       actors= typeof actors==='string'?[actors]:actors
                db.Movie.update(
                    {
                    title: title.trim(),
                    rating,
                    awards,
                    release_date,
                    length,
                    genre_id,
                    },
                    {
                        where:{
                            id:req.params.id
                        }
                    })
                    .then(()=>{
                        db.Actor_Movie.destroy({
                            where:{
                                movie_id:req.params.id
                            }
                        }).then(()=>{
                            if(actors ){
                            const actorsDB= actors.map(actor=>{
                                return {
                                    movie_id:req.params.id,
                                    actor_id:actor
                                }
                            })
                            db.Actor_Movie.bulkCreate(actorsDB,{
                                validate:true
                            }).then(()=>console.log('actores agregados'))
                        }
                        })
                    })
                    .catch(error=>console.log(error))
                    .finally(()=>{
                        res.redirect('/movies')
                    })
            
       
       
    },
    delete: function (req,res) {
        db.Movie.findByPk(req.params.id)
        .then(movie=>{
            res.render('moviesDelete',{movie})
        })
      
    },
    destroy: function (req,res) {

        db.Actor_Movie.destroy({
            where:{
                movie_id:req.params.id
            }
        }).then(()=>{
            db.Actor.update({
                favorite_movie_id:null
            },
            {
                where:{
                    favorite_movie_id:req.params.id
                }
            }).then(()=>{
                db.Movie.destroy({
                    where:{
                        id:req.params.id
                    }
                }).then(()=>{
                    return res.redirect('/movies')
                })
            })
        }).catch(error=>console.log(error))
    }
}

module.exports = moviesController;