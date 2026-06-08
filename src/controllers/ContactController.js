import { ContactService } from "../services/ContactService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class ContactController {
  constructor() {
    this.contactService = new ContactService();
  }

  send = asyncHandler(async (req, res) => {
    const result = await this.contactService.send(req.body);
    res.status(201).json(result);
  });
}

