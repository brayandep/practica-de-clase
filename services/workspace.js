require('dotenv').config(); // para cargar .env si no lo hace Playwright config

const BASE = process.env.BASE_URL || 'https://api.clickup.com/api/v2';
const TEAM_ID = process.env.ID_TEAM;
const TOKEN = process.env.TOKEN;

const auth = () => ({
  Authorization: TOKEN,
  'Content-Type': 'application/json'
});

exports.createSpace = (request, data = {}) =>
  request.post(`${BASE}/team/${TEAM_ID}/space`, {
    headers: auth(),
    data
  });

exports.getSpace = (request, spaceId) =>
  request.get(`${BASE}/space/${spaceId}`, {
    headers: auth()
  });

exports.deleteSpace = (request, spaceId) =>
  request.delete(`${BASE}/space/${spaceId}`, {
    headers: auth()
  });

exports.authlessDelete = (request, spaceId) =>
    request.delete(`${BASE}/space/${spaceId}`, {
      headers: { 'Content-Type': 'application/json' } // sin Authorization
    });