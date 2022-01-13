const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const router = express.Router()

router.get('/login', (req, res) => {
    res.render('login')
})

// 加入 middleware，驗證 reqest 登入狀態
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))


router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    User.findOne({ where: { email } }).then(user => {
        if (user) {
            const error = 'User already exists'
            return res.render('register', {
                name,
                email,
                password,
                confirmPassword,
                error
            })
        }
        if (password !== confirmPassword) {
            const error = '確認密碼與密碼不相符'
            return res.render('register', {
                name,
                email,
                password,
                confirmPassword,
                error
            })
        }
        return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(password, salt))
            .then(hash => User.create({
                name,
                email,
                password: hash
            }))
            .then(() => res.redirect('/'))
            .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', '登出成功!!')
    res.redirect('/users/login')
})




module.exports = router 