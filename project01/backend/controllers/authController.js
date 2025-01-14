const bcrypt = require("bcrypt");
const User=require('../models/User');
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid email or password");

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};




const signup = async (req, res) => {
    try {
      const { fullName, username, email, password, phone, age, gender, dateOfBirth, image } = req.body;

      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: "Email or username already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword, // Store the hashed password
        phone,
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Return a success response
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

module.exports={
    login,signup
}

