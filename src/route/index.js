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

//=========================================================
//===========================================================
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }
  static getList = () => {
    return this.#list
  }
  static addProduct = (product) => {
    return this.#list.push(product)
  }
  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static deleteById = (id) => {
    console.log('ID:', id)
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    console.log(index)
    if (index !== -1) {
      this.#list.splice(index, 1)
      console.log(this.#list)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static update(product, { name, price, description }) {
    product.name = name
    product.price = price
    product.description = description
  }
}

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.addProduct(product)

  res.render('alert', {
    style: 'alert',
    info: 'Товар створений',
  })
})

router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query

  const product = Product.getById(Number(id))

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-edit', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-edit',

    data: {
      product,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: 'Товар видалений',
  })
})

router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  const product = Product.getById(Number(id))

  Product.update(product, { name, price, description })

  res.render('alert', {
    style: 'alert',
    info: 'Товар оновлен',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
