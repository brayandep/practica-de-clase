const LoginPage = require('../../framework/pages/LoginPage');

async function loginTest() {
  console.log('🚀 Iniciando test de login...');
  const loginPage = new LoginPage();

  try {
    // Inicializar browser
    await loginPage.initBrowser();
    
    // Navegar a la aplicación
    await loginPage.goto('https://app.clickup.com/login');
    
    // Realizar login
    console.log('📝 Realizando login...');
    await loginPage.login(
      process.env.TEST_EMAIL || 'test@example.com',
      process.env.TEST_PASSWORD || 'password123'
    );
    
    await loginPage.sleep(3000);
    
    // Verificar login exitoso
    const isLoggedIn = await loginPage.isLoginSuccessful();
    
    if (isLoggedIn) {
      console.log('✅ Login exitoso - Test PASADO');
    } else {
      const error = await loginPage.getErrorMessage();
      console.log('❌ Login fallido - Test FALLIDO');
      console.log('Mensaje de error:', error);
    }
    
  } catch (error) {
    console.log('❌ Error durante el test:', error.message);
  } finally {
    // Cerrar browser
    await loginPage.quit();
    console.log('🏁 Test de login completado');
  }
}

// Ejecutar test si es llamado directamente
if (require.main === module) {
  loginTest();
}

module.exports = loginTest;