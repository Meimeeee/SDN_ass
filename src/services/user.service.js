const User = require('../models/user.model');
const authenticateConfig = require("../auth/authenticate");

const sanitizeUser = (user) => {
    if (!user) return null

    const data = user.toObject ? user.toObject() : { ...user }
    delete data.password
    return data
}

const getUsers = async () => {
    return await User.find().select("-password")
}

const getUserById = async (id) => {
    return await User.findById(id).select("-password")
}

const getUserByUsername = async (username) => {
    return await User.findOne({ username })
}

const register = async(data) => {
    const user = await User.create(data)
    return sanitizeUser(user)
}

const login = async (username, password) => {
    const user = await User.findOne({ username })

    if (!user || !(await user.comparePassword(password))) {
        return null
    }

    const token = authenticateConfig.getToken(user)
    return { token, user: sanitizeUser(user) }
}

const updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true }).select("-password")
}

const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id)
}

const UserService = {
    getUsers,
    getUserById,
    getUserByUsername,
    register,
    login,
    updateUser,
    deleteUser,
    sanitizeUser
}
module.exports = UserService
