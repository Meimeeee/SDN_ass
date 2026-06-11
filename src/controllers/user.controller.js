const { Router } = require("express");
const authenticateConfig = require("../auth/authenticate");
const UserService = require("../services/user.service");

const UserController = Router()


const handleError = (res, err) => {
    const statusCode =
        err.name === "CastError" || err.name === "ValidationError" ? 400 : 500;

    return res.status(statusCode).json({ error: err.message });
};

UserController.get(
    "/",
    authenticateConfig.verifyUser,
    authenticateConfig.verifyAdmin,
    async (req, res) => {
        try {
            const users = await UserService.getUsers();
            res.json(users);
        } catch (err) {
            handleError(res, err);
        }
    });

UserController.get(
    "/:id",
    authenticateConfig.verifyUser,
    authenticateConfig.verifyAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json(user);
        } catch (err) {
            return handleError(res, err);
        }
    });

UserController.post("/register", async (req, res) => {
    try {
        const user = await UserService.register(req.body);
        return res.status(201).json(user);
    } catch (err) {
        return handleError(res, err);
    }
});

UserController.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const loginResult = await UserService.login(username, password);

        if (!loginResult) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        return res.status(200).json(loginResult);
    } catch (err) {
        return handleError(res, err);
    }
});

module.exports = UserController
