const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.10/passkey1").then(function() {
    console.log("connected to db");
}).catch(function() {
    console.log("failed to connect Db");
});

const credential = mongoose.model("credential", {}, "bulkmail");

app.post("/sendemail", function(req, res) {
    const msg = req.body.msg;
    const emailList = req.body.emailList;

    credential.find().then(function(data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "pragadeeshraguraman@gmail.com",
                pass: "dxnz vbhw moem tbbc",
            },
        });

        new Promise(async function(resolve, reject) {
            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail({
                        from: "pragadeeshraguraman@gmail.com",
                        to: emailList[i],
                        subject: "A message from Bulkmail app",
                        text: msg,
                    });

                    console.log("Email sent to " + emailList[i]);
                }
                resolve("Success");
            } catch (error) {
                reject("Failed");
            }
        })
        .then(function() {
            res.send(true);
        })
        .catch(function() {
            res.send(false);
        });
    }).catch(function(error) {
        console.log(error);
        res.send(false);
    });
});

app.listen(5000, function() {
    console.log("Server Started..");
});
