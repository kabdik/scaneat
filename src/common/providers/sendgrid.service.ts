import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';

import { ServerConfig } from '@/config/server.config';

@Injectable()
export class SendgridService {
  public async sendPassword(password:string, email:string):Promise<void> {
    SendGrid.setApiKey(ServerConfig.SENDGRID_API_KEY);
    const mail = {
      to: email,
      from: '87753859226.ansar@gmail.com', // Fill it with your validated email on SendGrid account
      subject: 'Your password for retaurant management site',
      text: `${password}`,
      html: `<h1>${password}</h1>`,
    };
    await SendGrid.send(mail);
    console.log(`E-Mail sent to ${mail.to}`);
  }
}
