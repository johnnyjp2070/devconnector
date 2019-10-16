const express = require('express')
const router = express.Router()

//@route POST api/auth

//@desc  Test Route

//@access Public

router.get('/', (req, res) => {
  res.send('Authorization Route')
})

module.exports = router
