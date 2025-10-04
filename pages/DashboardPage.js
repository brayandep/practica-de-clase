class DashboardPage {
    constructor(page) {
        this.page = page;
        this.workspaceSelector = '[data-test="sidebar-workspaces"]';
        this.createTaskButton = 'button:has-text("Create Task")';
        this.taskNameInput = 'textarea[aria-label="Task name"]';
        this.assigneeDropdown = '[data-test="task-assignee-input"]';
        this.createTaskConfirm = 'button:has-text("Create Task")';
        this.taskCreatedMessage = 'text=Task created successfully';
    }

    async waitForLoad() {
        await this.page.waitForSelector(this.workspaceSelector);
    }

    async createTask(taskName, assignee = null) {
        await this.page.click(this.createTaskButton);
        await this.page.fill(this.taskNameInput, taskName);
        
        if (assignee) {
            await this.page.click(this.assigneeDropdown);
            await this.page.fill(`${this.assigneeDropdown} input`, assignee);
            await this.page.click(`text=${assignee}`);
        }
        
        await this.page.click(this.createTaskConfirm);
        await this.page.waitForSelector(this.taskCreatedMessage, { timeout: 10000 });
    }

    async isTaskVisible(taskName) {
        return await this.page.isVisible(`text=${taskName}`);
    }
}

module.exports = DashboardPage;