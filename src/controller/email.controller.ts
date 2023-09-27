import asyncHandler from 'express-async-handler';
import { OK } from '../core/success.response';
import type { EmailRequestBody, TypedRequest } from './../types/types';
import type { Response } from 'express';
import emailService from '../service/email.service';

class EmailController {
  sendVerifyEmail = asyncHandler(
    async (req: TypedRequest<EmailRequestBody>, res: Response) => {
      OK(
        res,
        'Verify successfully!',
        await emailService.sendVerificationEmail(req.body)
      );
    }
  );
}

export default new EmailController();
