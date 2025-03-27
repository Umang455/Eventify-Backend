const express = require('express');
const Course = require('../models/course');

const router = new express.Router();

router.get('/', async (req, res) => {
    try {
        let match = {}
        let courses = await Course.find()
        res.status(201).send(courses)
    } catch (e) {
        console.log(e)
    }
})

router.post('/', async (req, res) => {
    try {
        let courses = new Course(req.body)
        await courses.save()
        res.status(201).send(courses)
    } catch (e) {
        console.log(e)
    }
})

// router.patch('/:id', async (req, res) => {
//     try {
//         let tableAssortment = await TableAssortment.findById(req.params.id)
//         if (!tableAssortment) {
//             console.log("nai mila")
//         }
//         const updates = Object.keys(req.body);

//         updates.forEach((update) => {
//             tableAssortment[update] = req.body[update]
//         });

//         await tableAssortment.save();
//         res.status(200).send(tableAssortment)

//     } catch (e) {
//         console.log(e)
//     }
// })

router.delete('/:id', async (req, res) => {
    try {
        let courses = await Course.findById(req.params.id)
        await courses.deleteOne()
        res.status(201).send(courses)
    } catch (e) {
        console.log(e)
    }
})




module.exports = router