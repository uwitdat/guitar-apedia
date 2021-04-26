const express = require('express')
const { route } = require('.')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Guitar = require('../models/guitar')
const Player = require('../models/player')
const { render } = require('ejs')
const uploadPath = path.join('public', Guitar.guitarImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// ALL GUITARS ROUTE
router.get('/', async (req, res) => {
    try {
        const guitars = await Guitar.find({})
        res.render('guitars/index', {
            guitars: guitars,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// NEW GUITAR ROUTE
router.get('/new', async (req, res) => {
    renderNewPage(res, new Guitar())
})

// CREATE GUITAR ROUTE
router.post('/', upload.single('image'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const guitar = new Guitar({
        name: req.body.name,
        player: req.body.player,
        year: req.body.year,
        imageName: fileName, 
        description: req.body.description
    })
    try {
        const newGuitar = await guitar.save()
        res.redirect(`guitars`)
    } catch {
        if(guitar.imageName != null){
        removeGuitarImage(guitar.imageName)
        }
        renderNewPage(res, guitar, true)
    }
})

function removeGuitarImage(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}


async function renderNewPage(res, guitar, hasError = false){
    try {
        const players = await Player.find({})
        const params = {
            players: players,
            guitar: guitar
            }
            if(hasError) params.errorMessage = "Error Creating Guitar"
            res.render('guitars/new', params)
        } catch {
        res.redirect('/guitars')
    }
}

module.exports = router