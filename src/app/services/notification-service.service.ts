import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private user: string = 'v5pUwATzHRUZK0bEP';
  private service: string = 'service_vxtac5r';

  constructor() {
    emailjs.init(this.user);
  }

  sendEmail(borrowerEmail: string, message: string) {
    const templateParams = {
        email: borrowerEmail,
        message: message,
    };
    console.log(templateParams);
    return emailjs.send(this.service, 'template_x5upovy', templateParams);  
}

}
