import rateLimit from 'express-rate-limit';

export const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 10000, // 24 hrs in milliseconds
  max: 10000,
  message: 'You have exceeded the 10000 requests in 10 seconds limit!', 
  standardHeaders: true,
  legacyHeaders: false,
});