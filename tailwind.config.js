const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
  ],
  theme: {
    extend: {
        fontFamily: {
            sans: ['Inter var', ...defaultTheme.fontFamily.sans]
        },
    },
  },
  plugins: [],
}
