require('dotenv').config()
// const fs = require('fs')
const emails = require('./email.json')
const accounts = require('./mailing-accounts.json')
// const emails = [
//   {
//   email: 'topcellular@live.com'
//   },
//   {
//     email: 'uzinatorcl@gmail.com'
//   },
//   {
//     email: 'uzinatorcl@live.com'
//   }
// ]
const nodemailer = require('nodemailer')
const email = require('./mailing-templates/email1')
// console.log(email)
let currentEmail = 0
let currentAccount = 0
let transporter = null

function createTransporter() {
  if (!accounts[currentAccount]) {
    transporter = null
    return
  }
  transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
      ciphers: 'SSLv3'
    },
    requireTLS: true,
    port: 465,
    debug: true,
    auth: {
      user: accounts[currentAccount],
      pass: process.env.EMAIL_PASS
    }
  })
}
//Check to see if theres a last email list.

const lastEmailIndex = emails.findIndex(e => !!e.pause)
console.log(lastEmailIndex)

const emailList = emails.splice(lastEmailIndex + 1, emails.length)

async function sendEmail(emailAddress) {
  if(typeof emailAddress === 'undefined') return
  if (!accounts[currentAccount]) return
  try {
    const reply = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailAddress,
      subject: 'Instant Activations, 0 Investment, and Free Simcards',
      html: email
    })
    console.log(!reply.rejected.length)
    return sendEmail(emailList[++currentEmail].email)
  } catch(err) {
    console.log("How many emails were sent", currentEmail)
    console.log(emailList[currentEmail])
    console.error(err)
    currentAccount++
    createTransporter()
    return sendEmail(emailList[++currentEmail].email)
  }
}

createTransporter()
sendEmail(emailList[currentEmail].email)
