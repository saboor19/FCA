const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

//-----------------get me user context------------
exports.getMe = async(req,res) => {
  try{

//     console.log("Cookies:", req.cookies);
// console.log("Token:", req.cookies.token);

    res.status(200).json({
      user:req.user
    });

  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};



//-----------REGISTER-------------------USER
exports.registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role
    } = req.body;


    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create User
    const user = await User.create({
      fullName,
      email: email.toLowerCase() ,
      password: hashedPassword,
      role
    });

    // Generate Token
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


//----------------LOGIN MODULE-----------------------
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = generateToken(
      user._id,
      user.role
    );

const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

    res.status(200).json({
      message:"Login successful",
      user:{
        id:user._id,
        name:user.fullName,
        email:user.email,
        role:user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.logoutUser = async(req,res) => {

  try{

    res.clearCookie("token");
    res.status(200).json({
      message:"Logout successful"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
