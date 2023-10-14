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
//===================================================================================
//===================================================================================
class ProductView {
  static #list = []
  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++ProductView.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProductView = new ProductView(...data)
    this.#list.push(newProductView)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    let filteredList = this.#list.filter(
      (product) => product.id !== id,
    )
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    return shuffledList.slice(0, 3)
  }
}
ProductView.add(
  'https://picsum.photos/200/300',
  'Комп`ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6-4.2ГГЦ)/ RAM 16 ГБ / HDD 1ТБ + SSD 450 ГБ / nVidia GeForce RTX 3050, 8ГБ / без ОД / LAN / без ОС ',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

ProductView.add(
  'https://picsum.photos/200/300',
  'Комп`ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6-4.2ГГЦ)/ RAM 16 ГБ / HDD 1ТБ + SSD 450 ГБ / nVidia GeForce RTX 3050, 8ГБ / без ОД / LAN / без ОС ',
  [{ id: 1, text: 'Готовий до відправки' }],
  20000,
  5,
)

ProductView.add(
  'https://picsum.photos/200/300',
  'Комп`ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6-4.2ГГЦ)/ RAM 16 ГБ / HDD 1ТБ + SSD 450 ГБ / nVidia GeForce RTX 3050, 8ГБ / без ОД / LAN / без ОС ',
  [{ id: 2, text: 'Топ продажів' }],
  40000,
  2,
)

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }
  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return Promocode.#list.find(
      (promo) => promo.name === name,
    )
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}
Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1
  static #count = 0
  static #list = []
  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updateBalance = currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updateBalance)
    console.log(email, updateBalance)
    return amount
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname
    this.phone = data.phone
    this.email = data.email
    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    Purchase.#list.push(newPurchase)
    return newPurchase
  }
  static getList = () => {
    return Purchase.#list.reverse().map((purchase) => {
      const obj = {
        id: purchase.id,
        title: purchase.product.title,
        price: purchase.totalPrice,
        bonus: Purchase.calcBonusAmount(
          purchase.totalPrice,
        ),
        amount: purchase.amount,
      }

      return obj
    })
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}
//===============================================================================
router.get('/purchase-index', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: ProductView.getList(),
    },
  })
})

router.get('/purchase-list', function (req, res) {
  // const id = Number(req.query.id)
  // const purchase = Purchase.getById(id)

  const items = Purchase.getList()

  res.render('purchase-list', {
    style: 'purchase-list',
    data: items,
  })
})

router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)
  const product = purchase.product

  res.render('purchase-info', {
    style: 'purchase-info',
    data: {
      id: id,
      title: product.title,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      totalPrice: purchase.totalPrice,
      deliveryPrice: purchase.deliveryPrice,
      productPrice: purchase.productPrice,
      bonus: purchase.bonus,
      amount: purchase.amount,
    },
  })

  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: ProductView.getRandomList(id),
      product: ProductView.getById(id),
    },
  })

  // ↑↑ сюди вводимо JSON дані
})

router.get('/purchase-update', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  res.render('purchase-update', {
    style: 'purchase-update',
    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
    },
  })
})
//========================================================================

router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  const id = Number(req.query.id)

  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alertNew', {
      style: 'alertNew',
      message: 'Помилка',
      info: 'Некоректна кількість товару',
      link: `/purchase-product?id=${id}`,
    })
  }

  const product = ProductView.getById(id)

  if (product.amount < amount) {
    return res.render('alertNew', {
      style: 'alertNew',
      message: 'Вибачте!',
      info: 'Такої кількості товару немає в наявності',
      link: `/purchase-product?id=${id}`,
    })
  }

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: `${productPrice}`,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      productPrice,
      totalPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })

  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: ProductView.getRandomList(id),
      product: ProductView.getById(id),
    },
  })

  router.post('/purchase-submit', function (req, res) {
    const id = Number(req.query.id)

    const product = ProductView.getById(id)

    if (!product) {
      return res.render('alertNew', {
        style: 'alertNew',
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      })
    }

    let {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      firstname,
      lastname,
      email,
      phone,
      promocode,
      bonus,
      comment,
    } = req.body

    if (product.amount < amount) {
      return res.render('alertNew', {
        style: 'alertNew',
        message: 'Вибачте!',
        info: 'Товару немає в потрібній кількості',
        link: `/purchase-list`,
      })
    }

    totalPrice = Number(totalPrice)
    productPrice = Number(productPrice)
    deliveryPrice = Number(deliveryPrice)
    amount = Number(amount)
    bonus = Number(bonus)

    if (
      isNaN(totalPrice) ||
      isNaN(productPrice) ||
      isNaN(deliveryPrice) ||
      isNaN(amount) ||
      isNaN(bonus)
    ) {
      return res.render('alertNew', {
        style: 'alertNew',
        message: 'Помилка',
        info: 'Некоректні дані',
        link: `/purchase-list`,
      })
    }
    if (!firstname || !lastname || !email || !phone) {
      return res.render('alertNew', {
        style: 'alertNew',
        message: "Заповніть обов'язкові поля",
        info: 'Некоректні дані',
        link: `/purchase-list`,
      })
    }

    if (bonus || bonus > 0) {
      const bonusAmount = Purchase.getBonusBalance(email)

      if (bonus > bonusAmount) {
        bonus = bonusAmount
      }
      Purchase.updateBonusBalance(email, totalPrice, bonus)
      totalPrice -= bonus
    } else {
      Purchase.updateBonusBalance(email, totalPrice, 0)
    }

    if (promocode) {
      promocode = Promocode.getByName(promocode)
    }

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }

    if (totalPrice < 0) totalPrice = 0

    const purchase = Purchase.add(
      {
        totalPrice,
        productPrice,
        deliveryPrice,
        amount,
        firstname,
        lastname,
        email,
        phone,
        promocode,
        bonus,
        comment,
      },
      product,
    )

    console.log(purchase)

    res.render('alertNew', {
      style: 'alertNew',
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    })
  })
})
router.post('/purchase-info', function (req, res) {
  const id = Number(req.query.id)

  res.render('purchase-update', {
    style: 'purchase-update',
    data: {
      id: id,
    },
  })
})

router.post('/purchase-update', function (req, res) {
  const id = Number(req.query.id)

  const data = req.body

  Purchase.updateById(id, data)

  // res.redirect(`/purchase-info?id=${id}`)
  // res.redirect(`/purchase-list`)

  res.render('alertNew', {
    style: 'alertNew',
    message: 'Успішно',
    info: 'Замовлення оновлено',
    link: `/purchase-list`,
  })
})
//===========================================================================================================================================
class Track {
  static #List = []
  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#List.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#List.reverse()
  }

  static getById = (id) =>
    Track.#List.find((item) => item.id === id)
}

Track.create(
  'Інь Янь',
  'MONATIK і ROXOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Beila Conmigo (Remix)',
  'Selena Gomez',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shameles',
  'Camila Cobello',
  'https://picsum.photos/100/100',
)
Track.create(
  'DAKITI',
  'BAD BUNNY',
  'https://picsum.photos/100/100',
)
Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photos/100/100',
)
Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist {
  static #list = []
  constructor(name) {
    this.id = this.id = Math.floor(
      1000 + Math.random() * 9000,
    )
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }
  static create(name) {
    const newPlaylist = new Playlist(name)
    Playlist.#list.push(newPlaylist)
    return newPlaylist
  }
  static getList() {
    return this.#list.reverse()
  }
  static makeMix(playlist) {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }
  static addTrackToPlaylist(playlist, track) {
    playlist.tracks.push(track)
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Пісні, що сподобались'))
Playlist.makeMix(Playlist.create('Спільний альбом'))
Playlist.makeMix(Playlist.create('Інь Янь'))
Playlist.makeMix(Playlist.create('Мій плейліст №1'))

router.get('/spotify-library', function (req, res) {
  res.render('spotify-library', {
    style: 'spotify-library',
    data: {
      playlists: Playlist.getList(),
    },
  })
})

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
})

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name
  if (!name) {
    return res.render('alertNew1', {
      style: 'alertNew1',
      message: 'Помилка',
      info: 'Введіть назву плейлиста',
      link: isMix
        ? `/spotify-create?isMix=true`
        : `/spotify-create`,
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  return res.render('alertNew1', {
    style: 'alertNew1',
    message: 'Успішно',
    info: 'Плейліст створений',
    link: `/spotify-playlist?id=${playlist.id}`,
  })
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alertNew1', {
      style: 'alertNew1',
      message: 'Помилка',
      info: 'Такого плейлиста не знайдено',
      link: `/spotify-create`,
    })
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
    },
  })
})

router.get('/spotify-playlist-add', function (req, res) {
  const id = Number(req.query.playlistId)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alertNew1', {
      style: 'alertNew1',
      message: 'Помилка',
      info: 'Такого плейлиста не знайдено',
      link: `/spotify-create`,
    })
  }

  console.log(playlist)

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)
  playlist.deleteTrackById(trackId)

  if (!playlist) {
    if (!playlist) {
      return res.render('alertNew1', {
        style: 'alertNew1',
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-playlist?id=${playlist.id}`,
      })
    }
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
    },
  })
})

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const trackId = Number(req.query.trackId)

  const track = Track.getById(trackId)

  console.log(track)

  const playlist = Playlist.getById(playlistId)

  console.log(playlist)

  if (!playlist) {
    return res.render('alertNew1', {
      style: 'alertNew1',
      message: 'Помилка',
      info: 'Такого плейлиста не знайдено',
      link: `/spotify-playlist?id=${playlist.id}`,
    })
  }

  Playlist.addTrackToPlaylist(playlist, track)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks.reverse(),
    },
  })
})

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
