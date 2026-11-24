/**
 * Contrato do telefone exibido na vitrine.
 *
 *   node --import tsx --test scripts/test-telefone.test.ts
 *
 * O bug em produção era `555511932785602`: o número já vinha com DDI e o front
 * prefixava `55` de novo. Aqui a regra é testada nos dois sentidos.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatarTelefoneBrasil,
  normalizarTelefoneWhatsapp,
  urlWhatsappCorretor,
} from '../src/lib/telefone';

test('normaliza telefone sem e com DDI sem duplicar o prefixo', () => {
  assert.equal(normalizarTelefoneWhatsapp('11947294883'), '5511947294883');
  assert.equal(normalizarTelefoneWhatsapp('(11) 94729-4883'), '5511947294883');
  assert.equal(normalizarTelefoneWhatsapp('5511932785602'), '5511932785602');
  assert.equal(normalizarTelefoneWhatsapp('+55 (11) 93278-5602'), '5511932785602');
  assert.equal(normalizarTelefoneWhatsapp(''), '');
});

test('formata para exibição sem o DDI', () => {
  assert.equal(formatarTelefoneBrasil('5511932785602'), '(11) 93278-5602');
  assert.equal(formatarTelefoneBrasil('11947294883'), '(11) 94729-4883');
});

test('link do WhatsApp usa o E.164 exatamente uma vez', () => {
  const url = urlWhatsappCorretor('5511932785602', 'Brazza') || '';
  assert.ok(url.startsWith('https://wa.me/5511932785602?'), url);
  assert.ok(!url.includes('5555'), 'DDI duplicado');
  assert.ok(url.includes(encodeURIComponent('Olá Brazza')), 'saudação personalizada');
  assert.equal(urlWhatsappCorretor('', 'Brazza'), null);
});
