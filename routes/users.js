const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const Student = require('../models/student');

const jwt = require('jsonwebtoken');
const { transporter } = require('../email/nodemailer');

const router = new express.Router();

router.get('/', async (req, res) => {
  try {

    // let { isSystemUser, isClientUser } = req.query
    // const match = {}

    // if (isSystemUser) {
    //   match.isSystemUser = isSystemUser
    // }
    // if (isClientUser) {
    //   match.isClientUser = isClientUser
    // }
    let users = await User.find()
    console.log(users)
    res.status(201).send(users)
  } catch (e) {
    console.log(e)
  }
})
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(user);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Something went wrong' });
  }
});


router.post('/', async (req, res) => {
  try {
    let user = new User(req.body)
    let isExistEmail = await User.find(user.email)
    let isExistPhone = await User.find(user.phone)
    if (isExistEmail || isExistPhone) {
      console.log("User Already Exists")
      res.status(500).send("User Already exists change the username or email")
      return
    } else {
      await user.save()
      res.status(201).send("user already exists")
    }
  } catch (e) {
    console.log(e)
  }
})

router.patch('/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id)
    const updates = Object.keys(req.body);

    updates.forEach((update) => {
      user[update] = req.body[update]
    });

    await user.save();
    res.status(200).send(user)

  } catch (e) {
    console.log(e)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const loginAs = req.body.loginAs
    // console.log(loginAs, "MY LOGIN ASSSS")
    let user = {}
    user = await User.findOne({ email });
    // user.isFaculty = true


    if (!user) {
      res.status(400);
      res.send('User not found');
      return;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      // req.flash('error', 'Invalid username or password');
      // res.redirect('/login');
      res.status(400);
      res.send('Incorrect Password');
      console.log("Wrong Password")
      return;
    }
    res.status(201).send(user)



  } catch (e) {
    console.log(e)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id)
    if (!user) {
      console.log("No user")
    }
    await user.deleteOne()
    res.status(201).send(user)

  } catch (e) {
    console.log(e)
  }
})



router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, address, role } = req.body;

    // Validate required fields
    if (!email || !password || !name || !phone || !address || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      address,
      role,
      isAdmin: role === 'Admin',
      status: 'Active'
    });

    await newUser.save();

    // Send welcome email
    var mailOptions = {
      from: "umangsomani7@gmail.com",
      to: email,
      subject: `Welcome to Eventify ${name}`,
      html: `
        <h1>Welcome to Eventify!</h1>
        <p>Dear ${name},</p>
        <p>Thank you for registering with Eventify. We're excited to have you on board!</p>
        <p>Your account has been created successfully with the following details:</p>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Role: ${role}</li>
        </ul>
        <p>You can now log in to your account and start managing events.</p>
        <p>Best regards,<br>The Eventify Team</p>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).json(newUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;