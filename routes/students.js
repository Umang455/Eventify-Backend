const express = require('express');
const Student = require('../models/student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter } = require('../email/nodemailer');
const upload = require('../middleware/upload');

const router = new express.Router();

router.get('/', async (req, res) => {
    try {
        let match = {}
        let students = await Student.find(match)
        console.log(students)
        res.status(201).send(students)
    } catch (e) {
        console.log(e)
    }
})

router.post('/', async (req, res) => {
    try {
        let student = new student(req.body)
        let isExistEmail = await Student.find(student.email)
        let isExistPhone = await Student.find(student.phone)
        if (isExistEmail || isExistPhone) {
            console.log("student Already Exists")
            res.status(500).send("student Already exists change the studentname or email")
            return
        } else {
            await student.save()
            res.status(201).send("student already exists")
        }
    } catch (e) {
        console.log(e)
    }
})

router.patch('/:id', async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
        const updates = Object.keys(req.body);

        updates.forEach((update) => {
            student[update] = req.body[update]
        });

        await student.save();
        res.status(200).send(student)

    } catch (e) {
        console.log(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const student = await Student.findOne({ email });
        if (!student) {
            res.status(400);
            res.send('student not found');
            return;
        }

        const passwordsMatch = await bcrypt.compare(password, student.password);
        if (!passwordsMatch) {
            // req.flash('error', 'Invalid studentname or password');
            // res.redirect('/login');
            res.status(400);
            res.send('Incorrect Password');
            console.log("Wrong Password")
            return;
        }


        res.status(201).send(student)
    } catch (e) {
        console.log(e)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
        if (!student) {
            console.log("No student")
        }
        await student.deleteOne()
        res.status(201).send(student)

    } catch (e) {
        console.log(e)
    }
})



router.post('/register', upload.single("studentImage"), async (req, res) => {
    try {
        const { email, } = req.body;

        const existingstudent = await Student.findOne({ email });
        if (existingstudent) {
            return res.status(409).json({ message: 'studentname already exists' });
            // console.log("Hai student")
        }

        const password = "111111"
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword, "M<y passs")
        const newStudent = new Student(req.body);
        newStudent.password = hashedPassword
        console.log(req.body, "body")
        // const courses = req.body
        // return
        newStudent.coursesRegistered = JSON.parse(req.body.coursesRegistered)
        var mailOptions = {
            from: "umangsomani7@gmail.com",
            // to: `work.soumil@gmail.com`,
            to: `${req.body.email}`,
            subject: `Welcome to the KJ SIT ${req.body.name} `,
            html: `Your password 111111`,
        };
        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
        await newStudent.save();

        res.status(201).send(newStudent);
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;