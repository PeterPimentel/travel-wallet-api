import sgMail from '@sendgrid/mail';

import { EMAIL_TEMPLATE } from '../util/constants';
import logger from '../util/logUtil';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const VERIFIED_SENDER = process.env.VERIFIED_SENDER;

sgMail.setApiKey(SENDGRID_API_KEY as string)

const NAME_SPACE = 'mail-service';

export const sendActivationAccountEmail = async (userEmail: string, token: string) => {
    logger.info(NAME_SPACE, 'sendActivationAccountEmail');

    const email = {
        to: userEmail,
        from: VERIFIED_SENDER as string,
        html: `<div>Welcome, ${userEmail}<div/>`,
        dynamic_template_data: {
            email: userEmail,
            token: token,
        },
        template_id: EMAIL_TEMPLATE.account_verification
    }

    await sgMail.send(email)
}
