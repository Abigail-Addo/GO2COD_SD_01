import express from "express";
import contactController from "../controllers/contactController.js";

const router = express.Router();

router.get("/", contactController.allContacts);

router.post("/create", contactController.addContact);

router.get("/:id", contactController.singleContact);

router.delete("/:id", contactController.deleteContact);

router.patch("/:id", contactController.updateContact);

export default router;
