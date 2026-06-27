// authenticate.js

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const Question = require("../models/question.model");
const Env = require("../utils/env");

const JWT_SECRET = Env.JWT_SECRET;

// Cấu hình cách lấy token từ request
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

// Passport sẽ đọc token, giải mã token,
// sau đó tìm user thật trong database
passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload._id);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

// Tạo JWT token sau khi login thành công
const getToken = function (user) {
  const payload = {
    _id: user._id,
    username: user.username,
    admin: user.admin,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Middleware 1: kiểm tra đã đăng nhập chưa
const verifyUser = passport.authenticate("jwt", {
  session: false,
});

// Middleware 2: kiểm tra có phải Admin không
const verifyAdmin = (req, res, next) => {
  // verifyAdmin phải chạy sau verifyUser
  // vì verifyUser sẽ gắn user vào req.user

  if (req.user && req.user.admin === true) {
    return next();
  }

  const err = new Error("You are not authorized to perform this operation!");
  err.status = 403;
  return next(err);
};

const requireAuth = (req, res, next) => {
  return verifyUser(req, res, next);
};

// Middleware 3: kiểm tra có phải tác giả câu hỏi không
const verifyAuthor = async (req, res, next) => {
  try {
    const questionId = req.params.questionId || req.params.id;

    const question = await Question.findById(questionId);

    if (!question) {
      const err = new Error("Question not found");
      err.status = 404;
      return next(err);
    }

    // MongoDB ObjectId không nên so sánh bằng ===
    // Dùng .equals() cho chắc ăn
    if (question.author.equals(req.user._id)) {
      return next();
    }

    const err = new Error("You are not the author of this question");
    err.status = 403;
    return next(err);
  } catch (err) {
    return next(err);
  }
};

 const authenticateConfig = {
  getToken,
  verifyUser,
  requireAuth,
  verifyAdmin,
  verifyAuthor,
};

module.exports = authenticateConfig
