
const nconf = require("nconf")
const axios = require("axios");
const {sheetapi} = nconf.get("googlesheetapi")


const contact = module.exports;

contact.contactus = async (req) => {
  try {

    const {name,email,subject,message} = req.body
    const formdata ={};
    
    console.log("i am inside the contact us form api",req.body)

    formdata.name = name
    formdata.email = email
    formdata.subject = subject
    formdata.message = message

    await axios.post(sheetapi,formdata);

    return 


  } catch (error) {
    console.log("error in the sheet api report -->", error);
    throw new Error("error in the sheet api report");

  }
};