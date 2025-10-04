const BasePage = require('../base');

class TaskPage extends BasePage {
  constructor() {
    super();
    this.selectors = {
      quickAddButton: '[data-test*="quick-add-task"]',
      taskNameInput: '[data-test*="task-name-input"]',
      taskList: '[data-test*="task-item"]',
      taskCheckbox: '.task-checkbox',
      completedTask: '.task-completed',
      searchInput: '[data-test="header-search"] input'
    };
  }

  async createTask(taskName) {
    await this.click(this.selectors.quickAddButton);
    await this.type(this.selectors.taskNameInput, taskName);
    await this.driver.actions().sendKeys('\uE006').perform(); // Press Enter
    await this.sleep(1000);
  }

  async completeTask(taskIndex = 0) {
    const tasks = await this.findElements(this.selectors.taskCheckbox);
    if (tasks.length > taskIndex) {
      await tasks[taskIndex].click();
    }
  }

  async searchTask(taskName) {
    await this.type(this.selectors.searchInput, taskName);
    await this.driver.actions().sendKeys('\uE006').perform(); // Press Enter
  }

  async getTaskCount() {
    const tasks = await this.findElements(this.selectors.taskList);
    return tasks.length;
  }

  async isTaskVisible(taskName) {
    try {
      const element = await this.findElement(`text="${taskName}"`);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }
}

module.exports = TaskPage;