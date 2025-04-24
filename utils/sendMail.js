import nodemailer from 'nodemailer';

export const sendMail  = async(name, email, subject, message) =>{
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user:process.env.GMAIL_USER,
      pass:process.env.GMAIL_PASS,
    }
  });

  const mailOption = {
    from: name,
    to: process.env.GMAIL_USER,
    subject,
    html:`
      <p><strong>이메일:</strong> ${email}</p>
      <p><strong>메시지:</strong>${name}님 ${message}</p>`
  };

  try {
    await transporter.sendMail(mailOption);
    return 'success'
  } catch (error) {
    console.log('메일 전송 실패', error);
    return error;
  }

};