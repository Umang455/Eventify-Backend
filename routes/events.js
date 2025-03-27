const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateContent(prompt) {
    const genAI = new GoogleGenerativeAI("AIzaSyCEAyictrWgho4pBm4C9BDDly97WTrMhKk");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    return result.response.text();
}

let transporter = nodemailer.createTransport({
    // 'email-smtp.us-east-2.amazonaws.com',
    service: "gmail",
    host: "smtp.gmail.com",
    // port: 587,
    // ignoreTLS: false,
    auth: {
        user: "umang.duss@gmail.com",
        pass: "ckfreqcziopbjltc",
    },

    // host: 'smtp.gmail.com',
    // port: 587,
    // // tls: 465,
    // ignoreTLS: false,
    // auth: {
    //     user: process.env.SENDER_EMAIL_ADDRESS,
    //     pass: process.env.SENDER_EMAIL_PASSWORD,
    // }
});
const sendEmail = (to, subject, event) => {
    const invitationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
            <h1 style="color: #333; text-align: center;">You're Invited!</h1>
            <p style="color: #555; text-align: center;">Join us for an unforgettable event:</p>
            <div style="background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #007bff; margin: 0;">${event.eventName}</h2>
                <p style="color: #333;"><strong>Location:</strong> ${event.location}</p>
                <p style="color: #333;"><strong>Date:</strong> ${new Date(event.eventTime).toLocaleString()}</p>
            </div>
            <p style="color: #555; margin-top: 20px; text-align: center;">We look forward to seeing you there!</p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="http://localhost:3000/events" style="background: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block; font-weight: bold;">RSVP Now</a>
            </div>
        </div>
    `;

    const mailOptions = {
        from: 'youremail@gmail.com',
        to,
        subject,
        html: invitationHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


const router = new express.Router();

router.get('/', async (req, res) => {
    try {
        let events = await Event.find();
        res.status(201).send(events);
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res) => {
    try {
        let events = new Event(req.body);
        await events.save();
        res.status(201).send(events);
    } catch (e) {
        console.log(e);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let events = await Event.findById(req.params.id);
        await events.deleteOne();
        res.status(201).send(events);
    } catch (e) {
        console.log(e);
    }
});

router.post('/generate', async (req, res) => {
    try {
        console.log(req.body);
        let newPrompt = `${req.body.prompt} , Generate me 3 outputs 
        also 3 outputs should have same fields like Catering , Real venue in the location according to the theme  , theme , people , budget , activites and decoration . i can add them into array of 3 objects or u can do that for me , just give me the json nothing extra so i can parse the text string to json directly also just give output of the fields mentioned above , use the keyword venue for real venue in location make sure all object keys are lowercase , budget should be in ₹`;
        const textEvents = await generateContent(newPrompt);
        const trimmedTextEvents = textEvents.slice(7, -4);
        console.log(trimmedTextEvents);

        let events = JSON.parse(trimmedTextEvents);
        console.log(events);
        res.status(201).send(events);
    } catch (e) {
        console.log(e);
    }
});

router.post('/register/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.body.userId;

        let event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        if (event.registeredUsers.includes(userId)) {
            return res.status(400).send({ message: 'User already registered for this event' });
        }

        event.registeredUsers.push(userId);
        await event.save();

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.registeredEvents.push(eventId);
        await user.save();

        sendEmail(user.email, 'Event Registration', `You have successfully registered for the event: ${event.eventName}`);

        res.status(200).send({ message: 'User registered successfully', event, user });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.post('/invite/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        let event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }
        const invitations = req.body.invitations; // [{ name, email }, { name, email }]
        console.log(invitations, "invitations")
        // return
        invitations.forEach(invite => {
            sendEmail(invite.email, 'You are Invited!', event);
        });

        res.status(200).send({ message: 'Invitations sent successfully' });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
