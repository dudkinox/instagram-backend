"use strict";

const firebase = require("../db");
const Account = require("../models/login");
const firestore = firebase.firestore();
var md5 = require("md5");

const postRegister = async (req, res, next) => {
  try {
    const data = req.body;
    data.password = md5(data.password);
    await firestore.collection("account").doc().set(data);
    return res.send("success");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getAllAccount = async (req, res, next) => {
  try {
    const account = await firestore.collection("account");
    const data = await account.get();
    const AccountArray = [];
    if (data.empty) {
      res.status(404).send("ไม่พบข้อมูลใด");
    } else {
      data.forEach((doc) => {
        const account = new Account(
          doc.id,
          doc.data().username,
          doc.data().password,
          doc.data().email,
          doc.data().image
        );
        AccountArray.push(account);
      });
      res.send(AccountArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAccount = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Account = await firestore.collection("account").doc(id);
    const data = await Account.get();
    if (!data.exists) {
      res.status(404).send("หาไม่เจอ");
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getLogin = async (req, res) => {
  try {
    const email = req.params.email;
    const password = req.params.password;
    const hashPassword = md5(password);
    const accounts = await firestore
      .collection("account")
      .where("email", "==", email)
      .where("password", "==", hashPassword);
    const fetchAccount = await accounts.get();
    if (fetchAccount.empty) {
      res.status(200).send({
        id: "",
        email: "",
        password: "",
        name: "",
        image: "",
      });
    } else {
      return res.status(200).send({
        id: fetchAccount.docs[0].id,
        email: fetchAccount.docs[0].data().email,
        password: fetchAccount.docs[0].data().password,
        name: fetchAccount.docs[0].data().name,
        image: fetchAccount.docs[0].data().image,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateAccount = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const Account = await firestore.collection("login").doc(id);
    await Account.update(data);
    res.send("แก้ไขข้อมูลแล้ว");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firestore.collection("login").doc(id).delete();
    res.send("ลบสำเร็จ");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  postRegister,
  getAllAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  getLogin,
};
