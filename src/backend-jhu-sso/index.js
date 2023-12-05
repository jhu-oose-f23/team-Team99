const express = require("express");
const passport = require("passport");
const saml = require("passport-saml");
const session = require("express-session");
const bodyParser = require("body-parser");
const fs = require("fs");

const PbK = fs.readFileSync(__dirname + "/cert.pem", "utf8");
const PvK = fs.readFileSync(__dirname + "/key.pem", "utf8");

const JHU_SSO_URL = "https://idp.jh.edu/idp/profile/SAML2/Redirect/SSO";
const SP_NAME = "https://jhu-sso-api.onrender.com";
const BASE_URL = "https://jhu-sso-api.onrender.com";

// Setup SAML strategy
const samlStrategy = new saml.Strategy(
  {
    // config options here
    entryPoint: JHU_SSO_URL,
    issuer: SP_NAME,
    callbackUrl: `${BASE_URL}/jhu/login/callback`,
    decryptionPvk: PvK,
    privateCert: PvK,
    identifierFormat: null,
  },
  (profile, done) => {
    return done(null, profile);
  }
);

// Tell passport to use the samlStrategy
passport.use("samlStrategy", samlStrategy);

// Serialize and deserialize user for paqssport
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Initialize express.
const app = express();

// Set up port.
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({ secret: "use-any-secret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize({}));
app.use(passport.session({}));

// Set up homepage route
app.get("/", (req, res) => {
  res.send("Test Home Page!");
});

// login route
app.get(
  "/jhu/login",
  (req, res, next) => {
    next();
  },
  passport.authenticate("samlStrategy")
);

// Logout route
app.get("/jhu/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// callback route
app.post(
  "/jhu/login/callback",
  (req, res, next) => {
    next();
  },
  passport.authenticate("samlStrategy"),
  (req, res) => {
    console.log(req.user);
    res.send(`
      <html>
        <body>
          <script type="text/javascript">
            // Post message with user uid
            window.ReactNativeWebView.postMessage('${req.user.uid}');
          </script>
        </body>
      </html>
    `);
  }
);

// route to metadata
app.get("/jhu/metadata", (req, res) => {
  res.type("application/xml");
  res.status(200);
  res.send(samlStrategy.generateServiceProviderMetadata(PbK, PbK));
});

// Start the server.
app.listen(port);
