const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const PORT = 3333;
const db = require("monk")("localhost:27017/local");

app.use(cors());

const demoCollection = db.get("demo");

app.post("/append", jsonParser, (req, res, next) => {
  demoCollection
    .insert(
      [
        {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          sex: req.body.sex,
        },
      ],
      (err, results, fields) => {
        if (err)
          return res.json({
            status: "error",
            message: err.writeErrors[0].errmsg,
          });

        res.json({ status: "ok", result: results[0] });
      }
    )
    .then(() => db.close());
});

app.post("/delete", jsonParser, (req, res, next) => {
  demoCollection
    .remove({ email: req.body.email }, (err) => {
      if (err) return res.json({ status: "error", message: err });
      res.json({ status: "ok" });
    })
    .then(() => db.close());
});

app.post("/update", jsonParser, (req, res, next) => {
  demoCollection
    .findOneAndUpdate({ email: req.body.email }, { $set: req.body })
    .then((updatedDoc) => {
      res.json({ status: "ok", update: updatedDoc });
    })
    .then(() => db.close());
});

app.listen(PORT, jsonParser, () => {
  console.log("CORS-enabled web server listening on port " + PORT);
});
