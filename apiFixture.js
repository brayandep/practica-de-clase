require('dotenv').config();
const { test, expect } = require('@playwright/test');
const fetch = require('node-fetch');

const API_URL = process.env.BASE_URL;
const TOKEN = process.env.TOKEN;
const WORKSPACE = process.env.WORKSPACE;

test.beforeAll(async () => {
  // Opcionalmente puedes verificar el estado de la API aquí
});

test.afterAll(async () => {
  // Aquí puedes hacer el teardown (limpieza) si es necesario, por ejemplo, eliminar tareas creadas.
});

async function makeApiRequest(endpoint, method = 'GET', body = null) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': TOKEN,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : null,
  });

  return response.json();
}