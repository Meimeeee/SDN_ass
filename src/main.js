// import
const express = require("express")
const routes = require("./routes")
const apiRoutes = require("./routes/api.route")
const methodOverride = require("method-override")
const path = require("path")
const fs = require("fs")
const ejs = require("ejs")
const hbs = require("hbs")

// create express
const main = express()

const registerPartials = (partialsDir) => {
    fs.readdirSync(partialsDir)
        .filter((fileName) => path.extname(fileName) === ".hbs")
        .forEach((fileName) => {
            const partialName = path.basename(fileName, ".hbs")
            const partialPath = path.join(partialsDir, fileName)
            const partialContent = fs.readFileSync(partialPath, "utf-8")

            hbs.handlebars.registerPartial(partialName, partialContent)
        })
}

// view engine setup
main.set("views", path.join(__dirname, "views"))
main.set("view engine", "ejs")

const partialsDir = path.join(__dirname, "views", "partials")

// middleware
main.use(express.json())
main.use(express.urlencoded({ extended: false }))
main.use(methodOverride("_method"))
main.use(express.static(path.join(__dirname, "public")))

// render EJS page inside HBS layout
main.use((req, res, next) => {
    res.renderWithLayout = async function (viewPath, data = {}) {
        try {
            const ejsHtml = await ejs.renderFile(
                path.join(__dirname, "views", `${viewPath}.ejs`),
                data
            )
            registerPartials(partialsDir)
            const layoutContent = fs.readFileSync(
                path.join(__dirname, "views", "layouts", "main.hbs"),
                "utf-8"
            )
            const layoutTemplate = hbs.handlebars.compile(layoutContent)
            const finalHtml = layoutTemplate({ ...data, body: ejsHtml })
            res.send(finalHtml)
        } catch (err) {
            console.error("Render error:", err)
            res.status(500).send("Rendering failed: " + err.message)
        }
    }
    next()
})

// Home page.
main.get("/", (req, res) => {
    res.redirect("/quizzes")
})

// API routes.
main.use("/api", apiRoutes)

// UI routes.
main.use("/", routes)

// catch 404
main.use((req, res) => {
    res.status(404).json({ error: "Route not found" })
})

// error handler
main.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message || "Internal server error"
    })
})

module.exports = main
