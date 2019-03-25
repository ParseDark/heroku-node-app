const bcreypt = require('bcrypt')

async function run() {
    const salt = await bcreypt.genSalt(10) // 这个可以理解为hash的复杂度
    const hashed = await bcreypt.hash('1234', salt)
    console.log(salt)
    console.log(hashed)
}

run()