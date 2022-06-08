const Contact = require("../Model/ContactModel");
const createError = require('http-errors');
const mongoose = require("mongoose");
const { authContactSchema } = require("../Middleware/validator");
const csvtojson = require('csvtojson')

const contactController = {
  //get all contact
  getContacts : async (req, res, next) => {
    try {
      const {page=1,limit=10} = req.query
      //get contact with pagination
      const contact = await Contact.find({ user_id: req.user.id })
      .limit(limit*1)
      .skip((page-1)*limit);
      res.status(200).json(contact);
      if(!contact){
        throw createError(404,"Contact does not exist")
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //create contact
  createContact: async (req, res, next) => {
    try {
      const { firstName,contactNum,email,address} = req.body;
      //validating contact details
      const result = await authContactSchema.validateAsync(req.body)
      const newContact = new Contact({
        firstName,
        contactNum,
        email,
        address,
        user_id: req.user.id,
      });
      await newContact.save();
      res.status(200).json({ msg: "new contact created" });
    } catch (err) {
      if(err.isJoi === true){
        next(createError(422, err.message))
        return
      }
      next(err)
    }
  },

  //add bulk contact
  addBulkContact: async (req,res ,next) => {
    //csv file data to be inserted
    const filename = "MOCK_DATA.csv";

    var array= [];
    csvtojson()
        .fromFile(filename)
        .then(csvData => {
            for(var i=0;i<csvData.length;i++){
                var oneRow= {
                    firstName: csvData[i]["firstName"],
                    contactNum: csvData[i]["contactNum"],
                    email : csvData[i]["email"],
                    address: csvData[i]["address"],
                    user_id: req.user.id,
                };
                  array.push(oneRow);
            }
            //console.log(csvData);
            Contact.insertMany(array).then(function(){
                console.log("Data inserted");
                //res.json(array);
                res.json({msg: "success"});
            }).catch(function (error) {
                res.status(500).json({msg :err.message})   
            });
        });
  },

  //delete contact
  deleteContact: async (req, res ,next) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if(!contact){
        throw createError(404,"Contact does not exist")
      }
      res.status(200).json({ msg: "Contact deleted" });
    } catch (err) {
      if(err instanceof mongoose.CastError){
        next(createError(400,"Invalid Product Id"))
        return 
      }
      next(err)
    }
  },

  //update contact
  updateContact: async (req, res ,next) => {
    try {
      const { firstName,contactNum,email,address} = req.body;
      //validating contact details
      const result = await authContactSchema.validateAsync(req.body)
      //console.log(result);
      const contact = await Contact.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body}
      ).lean();
      if(!contact){
        throw createError(404,"Contact does not exist")
      }
      res.status(200).json({ msg: "Contact updated" });
    } catch (err) {
      if(err.isJoi === true){
        next(createError(422, err.message))
        return
      }
      if(err instanceof mongoose.CastError){
        next(createError(400,"Invalid Product Id"))
        return 
      }
      next(err)
    }
  },

  //get praticular contact
  getContact: async (req, res ,next) => {
    try {
      const contact = await Contact.findById(req.params.id).lean();
      if(!contact){
        throw createError(404,"Contact does not exist")
      }
      res.status(200).json(contact);
    } catch (err) {
      if(err instanceof mongoose.CastError){
        next(createError(400,"Invalid Product Id"))
        return 
      }
      next(err)
    }
  },
};
module.exports = contactController;
