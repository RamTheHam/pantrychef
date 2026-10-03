import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { readFile, readdir, stat } from 'node:fs/promises';

const api = 'https://ramtheham--pantrychef-analyze.modal.run/';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' };
const photo = 'tests/fixtures/pantry.png';
const response = {
  detected: ['tomato', 'egg'], count_exact: 1, mascot_line: 'Dinner is ready to plan.',
  results: [{ id: 'tomato-eggs', name: 'Tomato eggs', description: 'Simple pantry dinner', match: 'exact', time: 15, serves: 1, detected_ingredients: ['tomato', 'egg'], missing: [], recipe_ingredients: ['tomato', 'egg'], steps: ['Chop tomato.', 'Cook with eggs.'], dietary: ['vegetarian'], pro_tip: 'Use a warm pan.' }]
};

test('only camera is visible on mobile entry', async ({ app, screen, browser }) => {
  await app.open();
  await expect(screen.getByRole('button', 'Take a photo of your food')).toBeVisible();
  await expect(browser.locator('#reveal-screen')).toBeHidden();
  await expect(browser.locator('#results-screen')).toBeHidden();
  expect(await browser.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('upload generates recipes, records rating and preserves history', async ({ app, screen, browser }) => {
  let payload: any;
  await browser.route(api, async route => { payload = JSON.parse(route.request.postData!); await route.fulfill({ headers: cors, json: response }); });
  await app.open();
  await screen.getByPlaceholder('Anything else? (optional — what do you fancy?)').fill('quick dinner');
  await screen.getByRole('checkbox').uncheck();
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('heading', 'Tomato eggs')).toBeVisible();
  expect(payload.images).toHaveLength(1);
  expect(payload.images[0]).toMatch(/^data:image\/jpeg;base64,/);
  expect(payload.assume_basics).toBe(false);
  expect(payload.profile.note).toBe('quick dinner');
  await browser.locator('.recipe-details summary').tap();
  await expect(screen.getByText('Cook with eggs.')).toBeVisible();
  await screen.getByRole('button', '5 stars').tap();
  await screen.getByPlaceholder('one word if you like…').fill('delicious');
  await screen.getByRole('button', 'My dishes').tap();
  await expect(screen.getByText('1 dish cooked')).toBeVisible();
  await expect(screen.getByText('“delicious”')).toBeVisible();
  await browser.reload();
  await screen.getByRole('button', 'Settings').tap();
  await expect(browser.locator('#summary-box')).toContainText('Tomato eggs (5★)');
});

test('backend failure remains visible and can be retried', async ({ app, screen, browser }) => {
  await browser.route(api, async route => { await route.fulfill({ headers: cors, status: 503, body: 'service unavailable' }); });
  await app.open();
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('alert')).toContainText('503');
  await browser.unroute(api);
  await browser.route(api, async route => { await route.fulfill({ headers: cors, json: response }); });
  await screen.getByRole('button', 'Try again').tap();
  await expect(screen.getByRole('heading', 'Tomato eggs')).toBeVisible();
});

test('two camera captures are combined and retake resets x2 mode', async ({ app, screen, browser }) => {
  let payload: any;
  await browser.route(api, async route => { payload = JSON.parse(route.request.postData!); await route.fulfill({ json: response }); });
  await app.open();
  await screen.getByRole('button', 'Multiple photos').tap();
  await expect(screen.getByRole('button', 'Multiple photos')).toHaveAttribute('aria-pressed', 'true');
  await browser.locator('#file-input').setInputFiles([photo]);
  await expect(screen.getByText('Got one — snap the second')).toBeVisible();
  expect(payload).toBeUndefined();
  await browser.locator('#file-input').setInputFiles([photo]);
  await expect(screen.getByRole('button', 'My dishes')).toBeVisible();
  expect(payload.images).toHaveLength(2);
  await screen.getByRole('button', '← Retake').tap();
  await expect(screen.getByRole('button', 'Multiple photos')).toHaveAttribute('aria-pressed', 'false');
  await expect(screen.getByText('Just photograph your ingredients')).toBeVisible();
});

test('library accepts two photos together', async ({ app, screen, browser }) => {
  let count = 0;
  await browser.route(api, async route => { count = JSON.parse(route.request.postData!).images.length; await route.fulfill({ json: response }); });
  await app.open();
  await browser.locator('#library-input').setInputFiles([photo, 'tests/fixtures/pantry-second.png']);
  await expect(screen.getByRole('button', 'My dishes')).toBeVisible();
  expect(count).toBe(2);
});

test('invalid photo is rejected before contacting the server', async ({ app, screen, browser }) => {
  let calls = 0;
  await browser.route(api, async route => { calls++; await route.abort(); });
  await app.open();
  await browser.locator('#library-input').setInputFiles(['tests/fixtures/broken.png']);
  await expect(screen.getByRole('alert')).toContainText('could not be read');
  expect(calls).toBe(0);
});

test('too many library photos are rejected', async ({ app, screen, browser }) => {
  await app.open();
  await browser.locator('#library-input').setInputFiles([photo, 'tests/fixtures/pantry-second.png', 'tests/fixtures/broken.png']);
  await expect(screen.getByRole('alert')).toContainText('up to two');
});

for (const scenario of [
  { name: 'malformed JSON', body: 'not json', expected: 'unreadable response' },
  { name: 'incomplete recipe', json: { detected: ['tomato'], results: [{ name: 'broken' }] }, expected: 'incomplete recipes' }
]) {
  test(`${scenario.name} returns a recoverable error`, async ({ app, screen, browser }) => {
    await browser.route(api, async route => { await route.fulfill('body' in scenario ? { body: scenario.body } : { json: scenario.json }); });
    await app.open();
    await browser.locator('#library-input').setInputFiles([photo]);
    await expect(screen.getByRole('alert')).toContainText(scenario.expected);
    await expect(screen.getByRole('button', 'Try again')).toBeVisible();
  });
}

test('network failure remains visible without clearing the chosen photos', async ({ app, screen, browser }) => {
  await browser.route(api, async route => { await route.abort(); });
  await app.open();
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('alert')).toBeVisible();
  await expect(screen.getByRole('button', 'Try again')).toBeVisible();
});

test('cancel aborts pending request and leaves camera ready for retry', async ({ app, screen, browser }) => {
  await app.open();
  await browser.evaluate(() => {
    (window as any).aborted = false;
    window.fetch = (_url, options) => new Promise((_resolve, reject) => {
      options!.signal!.addEventListener('abort', () => { (window as any).aborted = true; reject(new DOMException('Aborted', 'AbortError')); });
    });
  });
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('button', 'Cancel')).toBeVisible();
  await screen.getByRole('button', 'Cancel').tap();
  await expect(screen.getByRole('button', 'Take a photo of your food')).toBeVisible();
  expect(await browser.evaluate(() => (window as any).aborted)).toBe(true);
  await expect(screen.getByRole('alert')).toBeHidden();
  await expect(browser.locator('#reveal-screen')).toBeHidden();
});

test('missing ingredients cannot be labelled an exact match on reveal', async ({ app, screen, browser }) => {
  const closest = { ...response, results: [{ ...response.results[0], name: 'Almost tomato eggs', missing: ['bread'] }] };
  await browser.route(api, async route => { await route.fulfill({ json: closest }); });
  await app.open();
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(browser.locator('#reveal-content')).toContainText('1 to buy');
  await expect(screen.getByRole('button', 'My dishes')).toBeVisible();
  await expect(screen.getByRole('heading', 'Almost there.')).toBeVisible();
  await expect(browser.locator('.recipe-card')).toContainText(/closest/i);
});

test('empty recognition completes without a spinner or recipe crash', async ({ app, screen, browser }) => {
  await browser.route(api, async route => { await route.fulfill({ json: { detected: [], results: [], count_exact: 0 } }); });
  await app.open();
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('heading', 'Almost there.')).toBeVisible();
  await expect(screen.getByText('No items recognised')).toBeVisible();
  await expect(screen.getByRole('button', '← Retake')).toBeVisible();
});

test('corrupt stored memory cannot break photo upload or settings', async ({ app, screen, browser }) => {
  await app.open();
  await browser.evaluate(() => localStorage.setItem('pantrychef.v1', '{"history":"bad","last_pantry":42}'));
  await browser.reload();
  await screen.getByRole('button', 'Settings').tap();
  await expect(screen.getByRole('heading', 'What Basil knows about you')).toBeVisible();
  await expect(browser.locator('#summary-box')).toContainText('Cooked —');
});

test('data download and erase confirmation complete settings journey', async ({ app, screen, browser }) => {
  await app.open();
  await browser.evaluate(() => localStorage.setItem('pantrychef.v1', JSON.stringify({ last_pantry: ['tomato'], history: [{ name: 'Tomato eggs', stars: 5, ingredients: ['tomato'], comment: 'nice' }] })));
  await browser.reload();
  await screen.getByRole('button', 'Settings').tap();
  const download = await browser.waitForDownload(() => screen.getByRole('button', 'Download my data (JSON)').tap());
  expect(download.suggestedFilename).toBe('pantrychef-data.json');
  // e2e returns a path relative to the attempt's artifact directory.
  const candidates = (await readdir('.e2e/artifacts', { recursive: true }))
    .filter(path => path.endsWith('/' + download.path));
  expect(candidates.length).toBeGreaterThan(0);
  const artifacts = await Promise.all(candidates.map(async path => ({ path: '.e2e/artifacts/' + path, modified: (await stat('.e2e/artifacts/' + path)).mtimeMs })));
  artifacts.sort((a, b) => b.modified - a.modified);
  const exported = JSON.parse(await readFile(artifacts[0].path, 'utf8'));
  expect(Object.keys(exported).sort()).toEqual(['exported_at', 'history', 'last_pantry', 'mascot_name']);
  expect(exported.exported_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  expect(Number.isFinite(Date.parse(exported.exported_at))).toBe(true);
  expect(exported.mascot_name).toBe('Basil');
  expect(exported.last_pantry).toEqual(['tomato']);
  expect(exported.history).toEqual([{ name: 'Tomato eggs', stars: 5, ingredients: ['tomato'], comment: 'nice' }]);
  await browser.onDialog('dismiss');
  await screen.getByRole('button', 'Erase everything on this phone').tap();
  await expect(browser.locator('#summary-box')).toContainText('Tomato eggs (5★)');
  await browser.onDialog('accept');
  await screen.getByRole('button', 'Erase everything on this phone').tap();
  await expect(screen.getByRole('status')).toContainText('erased');
  await expect(browser.locator('#summary-box')).toContainText('Cooked —');
});

test('clipboard failures are explained and privacy disclosure includes photos', async ({ app, screen, browser }) => {
  await app.open();
  await browser.evaluate(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } }));
  await screen.getByRole('button', 'Settings').tap();
  await expect(screen.getByText(/Photos, your cooking note/)).toBeVisible();
  await screen.getByRole('button', 'Copy to clipboard').tap();
  await expect(screen.getByRole('status')).toContainText('Download it instead');
});

test('large photos are compressed to the upload dimension limit', async ({ app, screen, browser }) => {
  let image: string;
  await browser.route(api, async route => { image = JSON.parse(route.request.postData!).images[0]; await route.fulfill({ json: response }); });
  await app.open();
  await browser.locator('#library-input').setInputFiles(['tests/fixtures/large-pantry.png']);
  await expect(screen.getByRole('button', 'My dishes')).toBeVisible();
  const dimensions = await browser.evaluate((data: string) => new Promise(resolve => {
    const photo = new Image();
    photo.onload = () => resolve({ width: photo.width, height: photo.height });
    photo.src = data;
  }), image!);
  expect(dimensions).toEqual({ width: 1200, height: 600 });
});

test('saved comments restore and ratings are sent as taste context', async ({ app, screen, browser }) => {
  let payload: any;
  await browser.route(api, async route => { payload = JSON.parse(route.request.postData!); await route.fulfill({ json: response }); });
  await app.open();
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('button', 'My dishes')).toBeVisible();
  await screen.getByPlaceholder('one word if you like…').fill('favourite');
  await screen.getByRole('button', '4 stars').tap();
  await screen.getByRole('button', '← Retake').tap();
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('button', 'My dishes')).toBeVisible();
  await expect(screen.getByPlaceholder('one word if you like…')).toHaveValue('favourite');
  expect(payload.profile.liked).toEqual(['tomato', 'egg']);
  expect(payload.profile.last_pantry).toEqual(['tomato', 'egg']);
  expect(payload.profile.history).toMatchObject([{ name: 'Tomato eggs', stars: 4, comment: 'favourite' }]);
});

test('desktop layout stays within the centered app shell', async ({ app, screen, browser }) => {
  await browser.setViewport({ width: 1280, height: 900 });
  await app.open();
  await expect(screen.getByRole('button', 'Take a photo of your food')).toBeVisible();
  const shell = await browser.locator('.app-shell').boundingBox();
  expect(shell!.width).toBeLessThanOrEqual(480);
  expect(shell!.x).toBeGreaterThan(0);
  expect(await browser.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('cancel during reveal removes delayed navigation', async ({ app, screen, browser }) => {
  await browser.route(api, async route => { await route.fulfill({ json: response }); });
  await app.open();
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(browser.locator('#reveal-content')).toContainText('Tomato eggs');
  await screen.getByRole('button', 'Cancel').tap();
  await expect(screen.getByRole('button', 'Take a photo of your food')).toBeVisible();
  // A new request must finish with its own result after the old reveal was cancelled.
  await browser.unroute(api);
  await browser.route(api, async route => { await route.fulfill({ json: { ...response, results: [{ ...response.results[0], name: 'Second dinner' }] } }); });
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('button', 'My dishes')).toBeVisible();
  await expect(screen.getByRole('heading', 'Second dinner')).toBeVisible();
  await expect(browser.locator('.recipe-card')).toHaveCount(1);
});

test('slow requests time out with a retry action', { timeout: 60000 }, async ({ app, screen, browser }) => {
  await app.open();
  await browser.evaluate(() => {
    window.fetch = (_url, options) => new Promise((_resolve, reject) => {
      options!.signal!.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    });
  });
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('alert')).toContainText('taking too long', { timeout: 50000 });
  await expect(screen.getByRole('button', 'Try again')).toBeVisible();
});


test('erasure clears stored data, the current cooking note, and retry photos', async ({ app, screen, browser }) => {
  let calls = 0;
  let payload: any;
  await browser.route(api, async route => { calls++; await route.abort(); });
  await app.open();
  await browser.evaluate(() => localStorage.setItem('pantrychef.v1', JSON.stringify({ mascot_name: 'Basil', last_pantry: ['onion'], history: [{ name: 'Soup', stars: 5, ingredients: ['onion'], comment: 'keep me' }] })));
  await browser.reload();
  await screen.getByLabel('Cooking preferences').fill('private cooking note');
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('button', 'Try again')).toBeVisible();
  expect(calls).toBe(1);
  await screen.getByRole('button', 'Settings').tap();
  await browser.onDialog('accept');
  await screen.getByRole('button', 'Erase everything on this phone').tap();
  expect(await browser.evaluate(() => JSON.parse(localStorage.getItem('pantrychef.v1')!))).toEqual({ mascot_name: 'Basil', history: [], last_pantry: [] });
  await browser.locator('#back-from-settings').tap();
  await expect(screen.getByLabel('Cooking preferences')).toHaveValue('');
  await expect(screen.getByRole('alert')).toBeHidden();
  await expect(screen.getByRole('button', 'Try again')).toBeHidden();
  // Even a programmatic retry cannot submit the erased in-memory photo.
  await browser.evaluate(() => (document.getElementById('retry-btn') as HTMLButtonElement).click());
  expect(calls).toBe(1);
  await browser.unroute(api);
  await browser.route(api, async route => { payload = JSON.parse(route.request.postData!); await route.fulfill({ json: response }); });
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('button', 'My dishes')).toBeVisible();
  expect(payload.profile.note).toBe('');
  expect(payload.profile.history).toEqual([]);
  expect(payload.profile.last_pantry).toEqual([]);
  expect(payload.profile.liked).toEqual([]);
  expect(payload.profile.disliked).toEqual([]);
});

test('FileReader failure returns a visible error without contacting the server', async ({ app, screen, browser }) => {
  let calls = 0;
  await browser.route(api, async route => { calls++; await route.abort(); });
  await app.open();
  await browser.evaluate(() => {
    FileReader.prototype.readAsDataURL = function () {
      this.dispatchEvent(new ProgressEvent('error'));
    };
  });
  await browser.locator('#library-input').setInputFiles([photo]);
  await expect(screen.getByRole('alert')).toHaveText('This photo could not be read.');
  await expect(screen.getByRole('button', 'Try again')).toBeHidden();
  expect(calls).toBe(0);
});

test('a photo larger than 20 MB is rejected before reading or uploading', async ({ app, screen, browser }) => {
  let calls = 0;
  await browser.route(api, async route => { calls++; await route.abort(); });
  await app.open();
  await browser.evaluate(() => {
    (window as any).fileReadCalls = 0;
    FileReader.prototype.readAsDataURL = function () { (window as any).fileReadCalls++; };
  });
  // Create a real oversized browser File locally, avoiding a 20 MB CDP transfer.
  // Native file-picker selection itself is covered by the other upload tests.
  await browser.evaluate(() => {
    const files = new DataTransfer();
    files.items.add(new File([new Uint8Array(20 * 1024 * 1024 + 1)], 'oversized.jpg', { type: 'image/jpeg' }));
    const input = document.getElementById('library-input') as HTMLInputElement;
    input.files = files.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(screen.getByRole('alert')).toHaveText('Choose images smaller than 20 MB each.');
  await expect(screen.getByRole('button', 'Try again')).toBeHidden();
  expect(calls).toBe(0);
  expect(await browser.evaluate(() => (window as any).fileReadCalls)).toBe(0);
});
