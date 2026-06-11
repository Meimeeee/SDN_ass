const User = require('../models/user.model');
const authenticateConfig = require("../auth/authenticate");

const getUsers = async () => {
    return await User.find()
}

const getUserById = async (id) => {
    return await User.findById(id)
}

const getUserByUsername = async (username) => {
    return await User.findOne({ username })
}

const register = async(data) => {
    return await User.create(data)
}

const login = async (username, password) => {
    const user = await User.findOne({ username })

    if (!user || !(await user.comparePassword(password))) {
        return null
    }

    const token = authenticateConfig.getToken(user)
    return { token }
}

const updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true })
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
    deleteUser
}
module.exports = UserService
