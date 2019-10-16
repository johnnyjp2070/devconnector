const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../../models/Users')
const jwt = require('jsonwebtoken')
const config = require('config')

//@route POST api/users

//@desc  Test Route

//@access Public

router.post(
  '/',
  [
    check('name', 'Name is Required')
      .not()
      .isEmpty(),
    check('email', 'Include a Valid Email').isEmail(),
    check(
      'password',
      'Pleasse enter a password with 6 or more characters'
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      //Code to check if user exists
      let user = await User.findOne({ email: email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Already Exists' }] })
      }

      //Code for Gravatar

      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password
      })

      //code for encryption

      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save()

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.err(err.message)
      res.status(500).send('Server error')
    }
  }
)

module.exports = router
