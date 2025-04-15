const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require('multer');
const path = require('path');

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
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                
                body {
                    font-family: 'Poppins', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }
                
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 30px;
                    text-align: center;
                    color: white;
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                    animation: fadeInDown 1s ease;
                }
                
                .content {
                    padding: 30px;
                }
                
                .event-card {
                    background: #fff;
                    border-radius: 10px;
                    padding: 20px;
                    margin: 20px 0;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    animation: slideInUp 1s ease;
                }
                
                .event-title {
                    color: #2c3e50;
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 15px;
                }
                
                .event-details {
                    color: #34495e;
                    margin: 10px 0;
                }
                
                .event-details strong {
                    color: #2c3e50;
                }
                
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-weight: 500;
                    margin-top: 20px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }
                
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #7f8c8d;
                    font-size: 14px;
                }
                
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .event-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                
                .countdown {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    text-align: center;
                    margin: 20px 0;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.02);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>You're Invited!</h1>
                </div>
                <div class="content">
                    <div class="event-card">
                        <h2 class="event-title">${event.eventName}</h2>
                        <div class="event-details">
                            <p><strong>📍 Location:</strong> ${event.venue}</p>
                            <p><strong>📅 Date:</strong> ${new Date(event.eventTime).toLocaleDateString()}</p>
                            <p><strong>⏰ Time:</strong> ${new Date(event.eventTime).toLocaleTimeString()}</p>
                            ${event.description ? `<p><strong>📝 Description:</strong> ${event.description}</p>` : ''}
                        </div>
                        <div class="countdown">
                            <p>🎉 Don't miss out on this exciting event!</p>
                        </div>
                        <div style="text-align: center;">
                            <a href="https://eventify-frontend-rho.vercel.app/events" class="cta-button">RSVP Now</a>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <p>We look forward to seeing you there!</p>
                    <p>Best regards,<br>The Eventify Team</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: 'umang.duss@gmail.com',
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

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/events');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy', 'name email');
        res.status(200).send(events);
    } catch (e) {
        console.error('Error fetching events:', e);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.post('/', upload.single('bannerImage'), async (req, res) => {
    try {
        const { createdBy, ...eventData } = req.body;

        // Validate required fields
        if (!createdBy) {
            return res.status(400).json({ message: 'createdBy field is required' });
        }

        // Validate user exists
        const user = await User.findById(createdBy);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate event data
        if (!eventData.eventName || !eventData.location || !eventData.eventTime) {
            return res.status(400).json({
                message: 'Missing required fields: eventName, location, and eventTime are required'
            });
        }

        // Ensure all string fields are properly formatted
        const processedEventData = {
            ...eventData,
            people: typeof eventData.people === 'string' ? eventData.people : String(eventData.people),
            catering: typeof eventData.catering === 'string' ? eventData.catering : String(eventData.catering),
            budget: typeof eventData.budget === 'string' ? eventData.budget : String(eventData.budget),
            createdBy: createdBy
        };

        // If there's an uploaded file, add its path to the event data
        if (req.file) {
            processedEventData.bannerImage = req.file.path;
        }

        const event = new Event(processedEventData);
        await event.save();

        // Populate the createdBy field before sending response
        const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name email');
        res.status(201).send(populatedEvent);
    } catch (e) {
        console.error('Error creating event:', e);
        res.status(500).send({
            message: 'Error creating event',
            error: process.env.NODE_ENV === 'development' ? e.message : 'Internal server error'
        });
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
        let newPrompt = `Create 3 event options based on these details: ${req.body.prompt}
        
        For each option, provide the following details in a JSON array format:
        {
            "catering": "string describing catering options (e.g., 'Pizza, burgers, fries, soft drinks, and ice cream')",
            "venue": "string with a real venue name in the specified location",
            "theme": "string describing the event theme",
            "people": "string describing the number and type of attendees (e.g., '300 Brawl Stars community members (gamers and spectators)')",
            "budget": "string with budget in ₹ (e.g., '₹34,000')",
            "activities": "string describing planned activities",
            "decoration": "string describing decoration theme"
        }

        Important rules:
        1. The 'people' field must be a single string, never an array
        2. All fields must be strings, not arrays
        3. Return only the JSON array with 3 objects
        4. Do not include any additional text or explanations
        5. Use proper JSON formatting with double quotes
        6. For the budget field, use the Indian Rupee symbol (₹) and format numbers with commas (e.g., '₹50,000')
        7. For the catering field, provide a string description of the catering options
        8. For the people field, provide a single string describing the number and type of attendees`;

        const textEvents = await generateContent(newPrompt);
        const trimmedTextEvents = textEvents.slice(7, -4);
        console.log(trimmedTextEvents);

        let events = JSON.parse(trimmedTextEvents);

        // Process and validate each event
        events = events.map(event => {
            // Ensure all fields are strings and properly formatted
            const processedEvent = {
                ...event,
                // Handle people field
                people: typeof event.people === 'string' ? event.people :
                    Array.isArray(event.people) ? event.people[1] || event.people[0] :
                        String(event.people),

                // Handle catering field
                catering: typeof event.catering === 'string' ? event.catering :
                    Array.isArray(event.catering) ? event.catering[1] || event.catering[0] :
                        String(event.catering),

                // Handle budget field
                budget: typeof event.budget === 'string' ? event.budget :
                    Array.isArray(event.budget) ? event.budget[1] || event.budget[0] :
                        `₹${Number(event.budget).toLocaleString('en-IN')}`
            };

            // Remove any brackets from the string values
            Object.keys(processedEvent).forEach(key => {
                if (typeof processedEvent[key] === 'string') {
                    processedEvent[key] = processedEvent[key].replace(/\[|\]/g, '');
                }
            });

            return processedEvent;
        });

        console.log(events);
        res.status(201).send(events);
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Error generating events' });
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

router.post("/myEvents", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.registeredEvents || user.registeredEvents.length === 0) {
            return res.status(200).json({ registeredEvents: [] });
        }

        // Fetch full event details using event IDs
        const events = await Event.find({ _id: { $in: user.registeredEvents } });
        console.log(events, "events")
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching user events:", error);
        res.status(500).json({ message: "Internal server error" });
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

router.get('/my-created-events/:userId', async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.params.userId })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).send(events);
    } catch (e) {
        console.error('Error fetching created events:', e);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.get('/my-registered-events/:userId', async (req, res) => {
    try {
        const events = await Event.find({ registeredUsers: req.params.userId })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).send(events);
    } catch (e) {
        console.error('Error fetching registered events:', e);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.post('/save-schedule/:id', async (req, res) => {
    try {
        const { userId, schedule, scheduleOptions } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Verify if the user is the creator of the event
        if (event.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Only the event creator can save the schedule' });
        }

        event.savedSchedule = schedule;

        await event.save();
        res.status(200).json({ message: 'Schedule saved successfully', event });
    } catch (error) {
        console.error('Error saving schedule:', error);
        res.status(500).json({ message: 'Error saving schedule' });
    }
});

router.post('/generate-schedule/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Verify if the user is the creator of the event
        if (event.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Only the event creator can generate schedules' });
        }

        const prompt = `Create 1 schedule option for ${event.eventName} event happening on ${new Date(event.eventTime).toLocaleString()} at ${event.location}. 
        Event duration: ${event.eventDuration}
        Theme: ${event.theme}
        Activities: ${event.activities}
        
        For each option, provide a clear schedule with timings. Remove any asterisks (*) from the output and don't include any introductory text. Start each option with "Option 1:", "Option 2:", "Option 3:" directly. Format each timing in 24-hour format.`;

        let schedule = await generateContent(prompt);
        schedule = schedule.replace(/\*/g, '');

        const optionIndex = schedule.indexOf('Option 1:');
        if (optionIndex !== -1) {
            schedule = schedule.substring(optionIndex);
        }

        res.status(200).json({ schedule });
    } catch (error) {
        console.error('Error generating schedule:', error);
        res.status(500).json({ message: 'Error generating schedule' });
    }
});

// Bulk create events
router.post('/bulk', async (req, res) => {
    try {
        const events = req.body;
        const createdEvents = [];

        for (const eventData of events) {
            const event = new Event({
                ...eventData,
                createdBy: req.user._id // Assuming you have user authentication middleware
            });
            await event.save();
            createdEvents.push(event);
        }

        res.status(201).send(createdEvents);
    } catch (e) {
        console.error('Error creating bulk events:', e);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;
