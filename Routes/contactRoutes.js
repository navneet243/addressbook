const {
  getContacts,
  createContact,
  deleteContact,
  updateContact,
  getContact,
  addBulkContact,
  } = require("../Controllers/ContactController");
  
const auth = require("../Middleware/auth");
const router = require("express").Router();
  
//routes to get all contacts and add contact
router.route("/")
  .get(auth, getContacts)
  .post(auth,createContact);

// add bulk data
router.post('/addbulk',auth , addBulkContact)
  
//routes to get single contact , update contact and delete contact
router.route("/:id")
  .get(auth, getContact)
  .put(auth, updateContact)
  .delete(auth, deleteContact);
  
module.exports = router;
  