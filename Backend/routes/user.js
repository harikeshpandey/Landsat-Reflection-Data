const express = require("express");
const zod = require("zod");
const {User} = require("../root/db");
const JWT_SECRET = require('../config');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authMiddleware } = require ("../middleware/middleware");
const add_data=require('../scripts/user-wheels')
const axios = require('axios');

const signupSchema = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
});

router.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(req.body);
  
    if (!success) {
      return res.json({
        message: "Invalid input provided.",
      });
    }
  
    try {

      const user = await User.findOne({
        username: body.username,
      });
  
      if (user) {
        return res.json({
          message: "Username already taken.",
        });
      }
  
     
      const dbUser = await User.create(body);
      const userId = dbUser._id;
  
      const token = jwt.sign(
        {
          userId: dbUser._id,
        },
        JWT_SECRET
      );
  
      res.json({
        message: "User created successfully.",
        token: token,
      });
    } catch (error) {
      console.error(error); 
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  });
  

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
  });
  
  router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
      res.status(411).json({
        message: "Error While Updating Information",
      });
    }
    await User.updateOne(req.body, {
      id: req.userId,
    });
    res.json({
      message: "Updated Successfully",
    });
  });
  
  router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
  
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    res.json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user.id,
      })),
    });
  });
  router.post("/setnotify",async(req,res)=>{
    console.log(req.body);
    try{
      if (
        req.body.methods != null &&
        req.body.lat != null &&
        req.body.long != null &&
        req.body.time_stamp != null &&
        req.body.methods[0] != null &&
        req.body.methods[0].medium != null
      ){
        responce_sheet=await add_data(req.body)
        console.log(responce_sheet)
        res.status(responce_sheet[1]).json({'message':responce_sheet[0]});
      }
      else{
        res.status(405).json({'message':"Method Not Allowed"});
      }
    }
    catch(err){
      console.log(err);
      res.status(400).json({'message':err});
    }
  })

const N2YO_API_KEY = 'CT8VD3-BVWTP5-B2PPG8-5CJP';
const SENTINEL_2_NORAD_ID = '49260';

router.post("/n2yo", async (req, res) => {
  // Extract latitude and longitude from the query parameters or request body
  const { lat, lng } = req.body; // Alternatively, you can use req.body if it's a POST request
  console.log(req.body)
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    // Construct the URL for the N2YO API call
    const url = `https://api.n2yo.com/rest/v1/satellite/positions/${SENTINEL_2_NORAD_ID}/${lat}/${lng}/0/2/&apiKey=${N2YO_API_KEY}`;
    
    // Make the API request using axios
    const response = await axios.get(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Host': 'api.n2yo.com',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0',
        'Priority': 'u=0, i',
      }
    });

    // Respond to the client with the data from the N2YO API
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching satellite data:', error.message);
    return res.status(500).json({ error: 'Failed to fetch satellite data' });
  }
});


  module.exports = router;