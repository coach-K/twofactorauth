
const express = require("express");
const bodyParser = require('body-parser');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const uuid = require("uuid");
const speakeasy = require("speakeasy");
const QRCode = require('qrcode');
const path = require('path');

const app = express();

// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
var db = new JsonDB(new Config("myDataBase", true, false, '/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get("/", (req,res) => {
  res.sendFile('login.html', { root: path.join(__dirname, '/public') });
});

app.get("/api", (req,res) => {
  res.json({ message: "Welcome to the two factor authentication exmaple" })
});


app.post("/api/register", (req, res) => {
  console.log(req.body);
  const { fullname, email, password } = req.body;
  const id = uuid.v4();
  try {
    const path = `/user/${email}`;
    try {
      const theuser = db.getData(path);
      if (theuser) {
        res.json({ status: false});
        return;
      }
    } catch(e) {}
    // Create temporary secret until it it verified
    const temp_secret = speakeasy.generateSecret();
    // Create user in the database
    const user = { id, temp_secret, fullname, email, password };
    db.push(path, user);
    // Send user id and base32 key to user
    QRCode.toDataURL(temp_secret.otpauth_url, function (err, url) {
      res.json({status: true, id, url, email })
    });
  } catch(e) {
    console.log(e);
    res.status(500).json({ message: 'Error generating secret key'})
  }
})

app.post("/api/verify", (req,res) => {
  const { email, token } = req.body;
  try {
    // Retrieve user from database
    const path = `/user/${email}`;
    const user = db.getData(path);
    console.log({ user })
    const { base32: secret } = user.temp_secret;
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token
    });
    if (verified) {
      // Update user data
      db.push(path, { id: user.id, email, fullname: user.fullname, password: user.password, secret: user.temp_secret });
      res.json({ verified: true })
    } else {
      res.json({ verified: false})
    }
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user'})
  };
})

app.post("/api/validate", (req,res) => {
  const { email, token } = req.body;
  try {
    // Retrieve user from database
    const path = `/user/${email}`;
    const user = db.getData(path);
    console.log({ user })
    const { base32: secret } = user.secret;
    // Returns true if the token matches
    const tokenValidates = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1
    });
    if (tokenValidates) {
      res.json({ validated: true })
    } else {
      res.json({ validated: false})
    }
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user'})
  };
})

app.post("/api/login", (req,res) => {
  const { email, password } = req.body;
  try {
    // Retrieve user from database
    const path = `/user/${email}`;
    try {
      const user = db.getData(path);
      console.log({ user });
      if (user.password == password) {
        res.json({ status: true, email });
      } else {
        res.json({ status: false});
      }
    }catch(e) {
      res.json({ status: false});
      return;
    }
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user'})
  };
})

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}.`);
});
