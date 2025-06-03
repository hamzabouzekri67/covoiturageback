const User = require('../models/User');
const AppError = require('../utils/appError');
var https = require('follow-redirects').https;
var fs = require('fs');
const otpgen = require("otp-generator");


exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};


// Mettre à jour le profil
// exports.updateProfile = async (req, res, next) => {
//   try {
//     if (req.body.password) {
//       return next(new AppError('Cette route ne permet pas de modifier le mot de passe', 400));
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       req.body,
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.status(200).json({
//       status: 'success',
//       data: { user: updatedUser }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true 
    }); 

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

// Supprimer le compte
// exports.deleteProfile = async (req, res, next) => {
//   try {
//     await User.findByIdAndDelete(req.user.id);
//     res.status(204).json({
//       status: 'success',
//       data: null
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.deleteUser = async (req, res, next) => {
  try {    
    const user = await User.findByIdAndUpdate(req.params.id,{
      status:'deleted'
    });

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(204).json({
      status: 'success',
      data: true
    });
  } catch (err) {
    next(err);
  }
};

// Pour les admins
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      role: { $ne: "admin" },
      status:"pending",
   });    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (err) { 
    next(err);
  }
};   

exports.acceptedUser = async (req, res, next) => {
  try {    
      const user = await User.findByIdAndUpdate(req.params.id,
      {
        status:"accepted"
      },{new:true});      
    if (user != null) {
      res.status(200).json({
      status: 'success',
      data: user
    });
    }
  } catch (err) { 
    next(err);
  }
}; 

exports.rejectedUser = async (req, res, next) => {
  try {
      const user = await User.findByIdAndUpdate(req.params.id,{
        status:"rejeted"
      },{new:true});
    if (user != null) {
      res.status(200).json({
      status: 'success',
      data: user
    });
    }
  } catch (err) { 
    next(err);
  }
}; 

exports.forgetPass = async (req, res, next) => {
  try {
   const user = await User.findOne({
    telephone:`216${req.body.telephone}`,
    role:{$ne:"admin"}
   });

   if (user) { 
   var otp =  createOtp(res,user)
     res.status(200).json({
      status: 'success',
      data: {
        ...user.toObject(),
        otp:otp
      }
    });
   
   }else{
     res.status(203).json({
      status: 'failed',
      data: ""
    });
   }

  // next("no users")
   
  } catch (err) { 
    next(err);
  }
}; 
const createOtp = ()=>{
 const otp =  otpgen.generate(
    6,
      {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          digits: true,
          specialChars: false
    }
 )
 createOtps(otp) 

 return otp
   
}
const createOtps = (otp)=>{
 var options = {
    'method': 'POST',
    'hostname': '6959v8.api.infobip.com',
    'path': '/sms/2/text/advanced',
    'headers': {
        'Authorization': 'App 73436131a6e73c9851722e50c20557a5-d1de9a4b-a98c-477b-86b1-6229ffbad4f6',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    'maxRedirects': 20
};

var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
       // console.log(body.toString());
     
    });

    res.on("error", function (error) {
        console.error(error);
    });
});

var postData = JSON.stringify({
    "messages": [
        {
            "destinations": [{"to":"21629834047"}],
            "from": "447491163443",
            "text": `${otp}`
        }
    ]
});

req.write(postData);
req.end();
}