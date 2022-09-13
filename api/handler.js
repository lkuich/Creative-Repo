const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const jwt_decode = require("jwt-decode");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

const { getAuthToken, hasAdminOverride } = require("./utils");

const storage = require("./storage");

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(morgan("tiny"));
app.disable("x-powered-by");

const jwtCheck = jwt.expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_URI}/.well-known/jwks.json`,
  }),
  aud: process.env.AUTH0_AUD,
  algorithms: ["RS256"],
});

app.use((req, res, next) => {
  if (hasAdminOverride(req.headers)) {
    res.locals.token = { email: "test@admin.com", role: "admin" };
    return next();
  }

  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }

  return jwtCheck(req, res, next);
});

app.use(async (req, res, next) => {
  if (res.locals.token) {
    return next();
  }

  try {
    // Get token info
    const token = jwt_decode(getAuthToken(req.headers));
    token.role = token["https://hasura.io/jwt/claims"]?.["x-hasura-role"];
    res.locals.token = token;
  } catch (e) {
    return res.status(403).json(e.message);
  }

  next();
});

// Routes
app.use("/storage", storage);

// Error handling
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    console.error(err.stack);

    return res.status(err.ouptut?.statusCode || 500).json(err.output?.payload);
  }

  next();
});

module.exports.handler = serverless(app);
