module.exports = {
  roots: ['./resources/js'],
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['js', 'jsx'],
  testPathIgnorePatterns: ['node_modules/'],
  transform: {
    '^.+\\.jsx?$': ['@swc/jest'],
  },
  testMatch: ['**/*.test.jsx', '**/*.test.js'],
  moduleNameMapper: {
    // Mocks out all thesefile formats when tests are run
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
  }
}
