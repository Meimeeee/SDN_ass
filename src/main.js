// import
const express = require("express")
const QuizController = require("./controllers/quizController")
const QuestionController = require("./controllers/questionController")
const QuizViewController = require("./controllers/quizViewController")
const QuestionViewController = require("./controllers/questionViewController")
const methodOverride = require("method-override")
const path = require("path")
const fs = require("fs")
const ejs = require("ejs")
const Handlebars = require("handlebars")


// create express
const main = express()

// body parser
main.use(express.json())
main.use(express.urlencoded({ extended: true }))

// Set EJS as view engine
main.set('view engine', 'ejs');
main.set('views', path.join(__dirname, 'views'));

// method override for PUT and DELETE
main.use(methodOverride("_method"))

// static files
main.use(express.static(path.join(__dirname, "public")))


// Register all partials manually
const partialsDir = path.join(__dirname, 'views/partials');
fs.readdirSync(partialsDir).forEach(filename => {
    const match = /^([^.]+).hbs$/.exec(filename);
    if (!match) return;

    const name = match[1]; // 'header'
    const template = fs.readFileSync(path.join(partialsDir, filename), 'utf8');
    Handlebars.registerPartial(name, template);
});

// Middleware để render EJS và wrap trong HBS layout
main.use((req, res, next) => {
    res.renderWithLayout = async function (view, data = {}) {
        try {
            // Render EJS view thành string
            const ejsHtml = await ejs.renderFile(path.join(__dirname, 'views', `${view}.ejs`), data);

            // Đọc và compile layout.hbs
            const layoutPath = path.join(__dirname, 'views/layouts/main.hbs');
            const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
            const layoutTemplate = Handlebars.compile(layoutContent);

            // Render layout với {{body}} được thay bằng EJS output
            const finalHtml = layoutTemplate({ ...data, body: ejsHtml });

            res.send(finalHtml);
        } catch (err) {
            console.error('Render error:', err);
            res.status(500).send('Rendering failed: ' + err.message);
        }
    };
    next();
});


// ===== API Routes (JSON) =====
main.use("/api/quizzes", QuizController)
main.use("/api/questions", QuestionController)

// ===== FE Routes (HTML views) =====
main.use("/quizzes", QuizViewController)
main.use("/questions", QuestionViewController)

// Trang chủ - chuyển hướng về danh sách quiz
main.get("/", (req, res) => {
    res.redirect("/quizzes")
})


module.exports = main
