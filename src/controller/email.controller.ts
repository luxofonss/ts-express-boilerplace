import asyncHandler from 'express-async-handler';
import { OK } from '../core/success.response';
import type { EmailRequestBody, TypedRequest } from './../types/types';
import type { Request, Response } from 'express';
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

  handleVerifyEmail = asyncHandler(async (req: Request, res: Response) => {
    OK(
      res,
      'Verify successfully!',
      await emailService.handleVerifyEmail(req.params['token'])
    );
  });
}

export default new EmailController();
