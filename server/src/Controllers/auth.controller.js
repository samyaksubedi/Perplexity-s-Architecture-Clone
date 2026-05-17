import { sendEmail } from '../UTILS/EMAIL/email.util.js';

const signIn = async (req, res) => {};
const signUp = async (req, res) => {};
const verifyUser = async (req, res) => {};
// const testGM = async (req, res) => {
//   const { mail, subject, text } = req.body;

//   await sendEmail({ to: mail, subject: subject, text: text });
//   res.send('Sent successfully');
// };
export { signIn, signUp };
