const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      .then(result => {
        res.status(201).json({
          message: 'user created',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
            message: "Invalid authentication credentials!"
        })
      })
    })
}

exports.login = (req, res, next) => {
  let fetchedUser;
  // match is logged email is exist in DB on no
  User.findOne({email: req.body.email}).then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchedUser = user;
    // eger yuxaridaki if-e dusmedise, demeli email DB-de var
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    // yuxaridaki if-e de dushmedise demeli, hem email hem password dogrudu
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
      process.env.JWT_KEY,
      {expiresIn: '1h'});
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    })
  })
  .catch(err => {
    return res.status(401).json({
      message: "Invalid authentication credentials!"
  })
})
}
