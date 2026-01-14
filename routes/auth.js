const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await User.create({ name:req.body.name, email:req.body.email, password:hash });
  res.json({message:"Student registered"});
});

router.post("/login", async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.json({message:"User not found"});

  const ok = await bcrypt.compare(req.body.password, user.password);
  if(!ok) return res.json({message:"Wrong password"});

  const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET);
  res.json({token, role:user.role});
});

router.post("/create-admin", async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await User.create({ ...req.body, password:hash, role:"admin" });
  res.json({message:"Admin created"});
});

module.exports = router;
