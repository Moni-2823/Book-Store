// const nodemailer = require('nodemailer');

// // sendMail with template
// const sendMail = async (data) => {
//     try {
//       let transporter = nodemailer.createTransport({
//         service: "Godaddy",                      // any third party service
//         auth: {
//           user: 'Noreply@purchasebook.com',      // user id to sent from,
//           pass: "PurchaseBook@2024"              // password 
//         }
//       });
//       // send mail with defined transport object
//       await transporter.sendMail({
//         from: data.from,
//         to: data.to,
//         subject: data.subject,
//         text: data.text,
//         // attachments: [
//         //   {
//             // path: 'assets/logo.png',
//         //     cid: 'mail@er.com',
//         //   },
//         // ],
//         html: data.html,
//       });
//       console.log('::::Mail sent:::');
//       return ({code: 200})
//     } catch (error) {
//       console.log('Message sent failed::: ', error);
//       return ({code: 500})
//     }
// }



// const sendMailToUser =  async (email, password) => {
//   return sendMail({
//     to: `${email}`,
//     from: '"Purchase Book" <Noreply@purchasebook.com>',
//     subject: 'Credentials for your purchase book account.',
//     text: 'Credentials for your purchase book account.',
//     html: `<!doctype html>
//     <html>
//     <head>
//     <meta charset="utf-8">
//     <title>Credentials</title>
//     <link rel="preconnect" href="https://fonts.googleapis.com">
//     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//     <link href="abc" rel="stylesheet">
    
    
//      <style>
//       body {
//         font-family: 'Montserrat', sans-serif;
//       }
//       </style>
    
//     </head>
    
//     <body>
      
//     <table width="600" border="0" style="background: url(); background-repeat: repeat; background-position: center;
//       background-size: cover;
//       margin: 0 auto; 
//       margin-top: 5%;margin-bottom: 5%;
//       "
//       >
//       <tbody style="background: url(abc);
//       background-repeat: no-repeat;
//       background-size: 600px 313px">
//         <tr>
//         <td style="padding: 20px;text-align: center;color: #fff;border: none;margin: 22px;font-size: 23px;" > <img src="abc" class="Group" alt="Group" style="
//           width: 100px;"> <br> 
//           <h3 style="padding-bottom: 107px;padding-top: 53px;font-size: 30px;color: #fff;text-align: center;">User credentials</h3>
//         </td>
//       </tr>	
        
//         </tbody>
//       <tbody style="
//         top: -100px;
//         position: relative;
//     ">
//         <tr>
//           <td><center><img src=abc width="150" height="150" alt=""/></center></td>
//         </tr>
//         <tr>
//           <td style=" text-align: center;    padding-bottom: 30px; ">Dear,</td>
//         </tr>
//         <tr>
//           <td style="padding: 10px 80px; text-align: center; ">your Emailid is ${email}.</td>
//           <td style="padding: 10px 80px; text-align: center; ">your password is ${password}.</td>

//         </tr>
//         <tr>
//         </tr>
//         <tr>
//           <td style="width: 496px;height: 24px;font-family: 'Encode Sans';font-style: normal;font-size: 16px;line-height: 150%;
//          text-align: center;color: #838383;padding-top: 2}0px;">Please login with the above credentials.</td>
//         </tr>
//         <tr><td><br></td></tr>
//         <tr>
        
//           <td style="text-align: center;">Regard,<br>
//             Team Purchase Book</td>
//         </tr>
        
//       </tbody>
//     </table>
      
    
      
//     </body>
//     </html>
//     ` 
//   });
// }


// module.exports = {generateForgotPassEmail, sendMailToUser};


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.host,
  port: process.env.port,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

async function sendRevenueNotification(authorName, authorRevenue) {
  const subject = 'Revenue Tracking Notification';
  const text = `Dear ${authorName},\n\n
    Your revenue details for the current month, current year, and total revenue are as follows:\n
    Current Month Revenue: ${calculateCurrentMonthRevenue(authorName)}\n
    Current Year Revenue: ${calculateCurrentYearRevenue(authorName)}\n
    Total Revenue: ${authorRevenue}\n\n
    Thank you for your contributions!\n
    Best Regards,\n
    Bookstore Team`;

  await transporter.sendMail({
    from: process.env.user,
    to: authorName, // Assuming the author's email is their username for simplicity
    subject,
    text,
  });
}

async function calculateCurrentMonthRevenue(authorName) {
  try {
    // Find the author by username
    const author = await userModel.findOne({ username: authorName, role: 'Author' });

    if (!author) {
      throw new Error('Author not found');
    }

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based in JavaScript

    // Calculate the start and end of the current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // Query purchases made by the author within the current month
    const purchases = await purchaseHistoryModel.find({
      userId: author._id,
      purchaseDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Calculate the total revenue for the current month
    const currentMonthRevenue = purchases.reduce((totalRevenue, purchase) => {
      return totalRevenue + (purchase.price * purchase.quantity);
    }, 0);

    return currentMonthRevenue;
  } catch (error) {
    console.error(error);
    throw new Error('Error calculating current month revenue');
  }
}

async function calculateCurrentYearRevenue(authorName) {
  try {
    // Find the author by username
    const author = await User.findOne({ username: authorName, role: 'Author' });

    if (!author) {
      throw new Error('Author not found');
    }

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Calculate the start and end of the current year
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    // Query purchases made by the author within the current year
    const purchases = await PurchaseHistory.find({
      userId: author._id,
      purchaseDate: { $gte: startOfYear, $lte: endOfYear },
    });

    // Calculate the total revenue for the current year
    const currentYearRevenue = purchases.reduce((totalRevenue, purchase) => {
      return totalRevenue + (purchase.price * purchase.quantity);
    }, 0);

    return currentYearRevenue;
  } catch (error) {
    console.error(error);
    throw new Error('Error calculating current year revenue');
  }
}

module.exports = { sendRevenueNotification };