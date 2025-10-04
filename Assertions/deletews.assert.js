const { expect } = require('@playwright/test');

exports.expectDeleteOK = async (res) => {
  expect([200, 204]).toContain(res.status());
};

exports.expectNotFoundOnGet = async (res) => {
  expect([404, 400]).toContain(res.status());
};

exports.assertNoSensitiveData = async (res) => {
  const text = await res.text();
  expect(text).not.toMatch(/Authorization|api_key|password|token/i);
};
