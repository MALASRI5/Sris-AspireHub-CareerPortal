const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const collection = require("./models/config");

const router = express.Router();

bcrypt.setRandomFallback((len) => {
    return new Uint8Array(crypto.randomBytes(len));
});

module.exports = router;
