const BasePage = require('../base');

class LoginPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      emailInput: 'input[type="email"]',
      passwordInput: 'input[type="password"]',
      loginButton: 'button[type="submit"]',
      errorMessage: '.error-message',
      userAvatar: '[data-test="header-user-avatar"]'
    };
  }

  async login(email, password) {
    await this.type(this.selectors.emailInput, email);
    await this.type(this.selectors.passwordInput, password);
    await this.click(this.selectors.loginButton);
  }

  async isLoginSuccessful() {
    return await this.isVisible(this.selectors.userAvatar);
  }

  async getErrorMessage() {
    try {
      return await this.getText(this.selectors.errorMessage);
    } catch (error) {
      return null;
    }
  }
}

module.exports = LoginPage;