const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo

router.get('/new', (req, res) => {
    res.render('new')
})

router.post('/new', (req, res) => {
    const name = req.body.name
    const UserId = req.user.id
    Todo.create({
        name,
        UserId
    })
        .then(() => res.redirect('/'))
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    return Todo.findByPk(id)
        .then(todo => res.render('detail', { todo: todo.toJSON() }))
        .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    Todo.findByPk(id)
        .then(todo => res.render('edit', { todo: todo.toJSON() }))
})

router.post('/:id/edit', (req, res) => {
    const id = req.params.id
    const name = req.body.name
    Todo.update({ name }, {
        where: { id }
    })
        .then(() => res.redirect('/'))
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Todo.destroy({
        where: { id }
    })
        .then(() => res.redirect('/'))
})

module.exports = router 