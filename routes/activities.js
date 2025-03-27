const express = require('express');
const Activity = require('../models/activity');
const upload = require('../middleware/upload');


const router = new express.Router();

router.get('/', async (req, res) => {
    try {
        let { studentID } = req.query

        let match = {}
        if (studentID) {
            match.studentID = studentID
        }
        let activity = await Activity.find(match)
        res.status(201).send(activity)
    } catch (e) {
        console.log(e)
    }
})

router.post('/', upload.single("activityPdf"), async (req, res) => {
    try {
        let activity = new Activity(req.body)
        await activity.save()
        res.status(201).send(activity)
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

// router.delete('/:id', async (req, res) => {
//     try {
//         let tableAssortment = await TableAssortment.findById(req.params.id)
//         await tableAssortment.deleteOne()
//         res.status(201).send(tableAssortment)
//     } catch (e) {
//         console.log(e)
//     }
// })




module.exports = router