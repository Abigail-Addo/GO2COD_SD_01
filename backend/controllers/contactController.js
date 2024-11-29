import contactModel from "../models/contactModel.js";
import asyncHandler from "express-async-handler";

// fetching all contacts
const allContacts = asyncHandler(async (req, res) => {
  const contacts = await contactModel.find();

  if (!contacts || contacts.length === 0) {
    return res.status(404).json({ message: "No contacts found" });
  }

  return res.status(200).json(contacts);
});

// add new contact
const addContact = asyncHandler(async (req, res) => {
  if (!req.body.first_name || !req.body.phone_number || !req.body.email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingContact = await contactModel.findOne({
    $or: [{ email: req.body.email }, { phone_number: req.body.phone_number }],
  });

  if (existingContact) {
    return res.status(400).json({ message: "Contact already exists" });
  }

  const contact = await contactModel.create(req.body);

  return res.status(201).json(contact);
});

// find a single contact
const singleContact = asyncHandler(async (req, res) => {
  const contact = await contactModel.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  return res.status(200).json(contact);
});

// delete a contact
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await contactModel.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  return res.status(200).json({ message: "Contact deleted successfully" });
});

// update a contact
const updateContact = asyncHandler(async (req, res) => {
  const contact = await contactModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  return res
    .status(200)
    .json({ message: "Contact updated successfully", contact });
});

export default {
  allContacts,
  addContact,
  singleContact,
  deleteContact,
  updateContact,
};
