// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
//===============================================================
class User {
  static #List = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  varifyPassword = (password) => password === this.password

  static add = (user) => {
    return this.#List.push(user)
  }
  static getList = () => {
    return this.#List
  }
  static getById = (id) => {
    return this.#List.find((user) => user.id === id)
  }

  static deleteById = (id) => {
    const index = this.#List.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#List.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  // if (!user || !email) {
  //   return false
  // }

  // user.email = email
  // return true

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  //console.log(id)
  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body
  let result = false

  const user = User.getById(Number(id))

  if (user.varifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
