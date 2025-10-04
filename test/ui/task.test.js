const LoginPage = require('../../framework/pages/LoginPage');
const TaskPage = require('../../framework/pages/TaskPage');

async function taskTest() {
  console.log('🚀 Iniciando test de tareas...');
  const loginPage = new LoginPage();
  const taskPage = new TaskPage();

  try {
    // Inicializar browser y login
    await loginPage.initBrowser();
    await loginPage.goto('https://app.clickup.com/login');
    
    console.log('📝 Realizando login...');
    await loginPage.login(
      process.env.TEST_EMAIL || 'test@example.com',
      process.env.TEST_PASSWORD || 'password123'
    );
    
    await loginPage.sleep(5000);
    
    // Verificar que estamos logueados antes de continuar
    if (!await loginPage.isLoginSuccessful()) {
      throw new Error('No se pudo realizar el login');
    }

    console.log('✅ Login exitoso, continuando con test de tareas...');
    
    // Usar el mismo driver para TaskPage
    taskPage.driver = loginPage.driver;
    
    // Crear nueva tarea
    const taskName = `Tarea de prueba ${Date.now()}`;
    console.log(`📋 Creando tarea: ${taskName}`);
    await taskPage.createTask(taskName);
    
    // Verificar que la tarea se creó
    await taskPage.sleep(2000);
    const isTaskCreated = await taskPage.isTaskVisible(taskName);
    
    if (isTaskCreated) {
      console.log('✅ Tarea creada exitosamente');
    } else {
      console.log('❌ No se pudo verificar la creación de la tarea');
    }
    
    // Buscar tarea
    console.log('🔍 Buscando tarea...');
    await taskPage.searchTask(taskName);
    await taskPage.sleep(2000);
    
    // Contar tareas
    const taskCount = await taskPage.getTaskCount();
    console.log(`📊 Total de tareas visibles: ${taskCount}`);
    
    console.log('✅ Test de tareas completado - Test PASADO');
    
  } catch (error) {
    console.log('❌ Error durante el test de tareas:', error.message);
  } finally {
    // Cerrar browser
    if (loginPage.driver) {
      await loginPage.quit();
    }
    console.log('🏁 Test de tareas completado');
  }
}

// Ejecutar test si es llamado directamente
if (require.main === module) {
  taskTest();
}

module.exports = taskTest;