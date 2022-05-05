function checkPassword(password) {
    let params = {
        lower: false,
        upper: false,
        special: false,
        toolong: false
    }
    var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

    if (password.length > 7)
        params.toolong = true
    for (var i = 0; i < password.length; i++) {
        let char = password.charAt(i)
        if (char == char.toLowerCase())
            params.lower = true
        if (char == char.toUpperCase())
            params.upper = true
        if (format.test(char))
            params.special = true
        if (params.special && params.upper && params.lower)
            break
    }
    return params
}

module.exports = {
    checkPassword: checkPassword
}