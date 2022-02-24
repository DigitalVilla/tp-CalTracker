module.exports = {}

process.env = Object.assign(process.env, {
  TWILIO_PHONE_NUMBER: '+11111111111',
  FRONTEND_URL: 'https://www.valence-mock.com',
  JWT_SECRET: 'SOME_TOKEN',
})
