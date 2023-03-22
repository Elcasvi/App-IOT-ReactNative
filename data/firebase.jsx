// Import the firebase package downloaded to this proje
var admin = require("firebase-admin");

var serviceAccount = require("./secret-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://things-projectx-default-rtdb.firebaseio.com"
});

export default admin;