/*require('dotenv').config();
const { test, expect } = require('@playwright/test');
const fetch = require('node-fetch');

const API_URL = process.env.BASE_URL;
const TOKEN = process.env.TOKEN;
const WORKSPACE = process.env.WORKSPACE;

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
*/