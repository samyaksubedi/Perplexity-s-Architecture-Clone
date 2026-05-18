import { prisma } from '../Configs/postgress.config.js';
import { sendWelcomeEmail } from '../Services/email.service.js';
import { ApiError } from '../UTILS/API/error.api.js';
import { ApiResponse } from '../UTILS/API/response.api.js';
import { hashPassword } from '../UTILS/hash.util.js';
import { generateVerificationToken } from '../UTILS/token.util.js';

// const testGM = async (req, res) => {
//   const { mail, subject, text } = req.body;

//   await sendEmail({ to: mail, subject: subject, text: text });
//   res.send('Sent successfully');
// };
const signUp = async (req, res) => {
  `User submits (name, email, password)
          ↓
   Check if user's email is alr present or not , if alr present throw error response
          ↓
  Hash password (bcrypt)
          ↓
  Generate random token (crypto.randomBytes)
          ↓
  Save user to DB  → { isVerified: false, emailVerificationToken: token, emailVerificationTokenExpires: Date.now() + 24h }
          ↓
  Send email with link → https://yourapp.com/api/auth/verify/<token>
          ↓
  Return 201 → "Check your email"`;

  try {
    const { name, email, password } = req.body;
    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userExists) {
      return res
        .status(400)
        .json(new ApiError(400, 'User already exists with this email'));
    }
    const hashedPassword = await hashPassword(password);
    const { token, expires } = generateVerificationToken();
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerificationToken: token,
        emailVerificationTokenExpires: expires,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
      },
    });
    await sendWelcomeEmail({ to: email, name: name, verificationToken: token });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user,
          'User Registered Successfully ! Please check your Email and Verify it.',
        ),
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).json(new ApiError(500, 'Internal Server Error in /signUp'));
  }
};
const verifyUser = async (req, res) => {
  `User clicks link → GET /api/auth/verify/:token
        ↓
Find user WHERE emailVerificationToken = token
        AND emailVerificationTokenExpires > Date.now()   ← don't forget expiry check
        ↓
If not found → "Invalid or expired token"
        ↓
Update user → { isVerified: true, emailVerificationToken: null, emailVerificationTokenExpires: null }
        ↓
Return 200 → "Email verified, you can now login"`;

  try {
    const { token } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpires: {
          gt: new Date(),
        },
      },
    });
    if (!user) {
      return res
        .status(400)
        .json(new ApiError(400, 'Verification link expired or invalid'));
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpires: null,
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'User verified successfully'));
  } catch (error) {
    console.error(error.message);
    res.status(500).json(new ApiError(500, 'Internal Server Error at /verify'));
  }
};

const resendVerificationToken = (req, res) => {
  `POST /api/auth/resend-verification
User submits email
        ↓
Find user by email → if not found → 404
        ↓
Check isVerified === true → if true → "Email already verified" → 400
        ↓
Generate new token (crypto.randomBytes)
        ↓
Update user → { emailVerificationToken: newToken, emailVerificationTokenExpires: Date.now() + 24h }
        ↓
Send email with new link → /api/auth/verify/<newToken>
        ↓
Return 200 → "Verification email resent"`;
};
const signIn = async (req, res) => {
  `User submits (email, password)
        ↓
Find user by email → if not found → 401
        ↓
Check isVerified === true → if false → "Please verify your email first"
        ↓
bcrypt.compare(password, user.password) → if false → 401
        ↓
Sign JWT → jwt.sign({ userId, email }, SECRET, { expiresIn: '7d' })
        ↓
Set cookie → res.cookie('token', jwt, { httpOnly: true, secure: true, sameSite: 'strict' })
        ↓
Return 200 → user data (without password)`;
};

const logoutUser = async (req, res) => {
  `POST /api/auth/logout
        ↓
res.clearCookie('token')
        ↓
Return 200 → "Logged out"`;
};

export { signUp, resendVerificationToken, verifyUser, signIn, logoutUser };
