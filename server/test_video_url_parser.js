const assert = require('assert');
const {
  parseYouTubeUrl,
  parseGoogleDriveUrl,
  validateExternalVideoUrl
} = require('./utils/videoUrlHelpers');

console.log('🧪 Starting External Video URL Parser Test Suite...\n');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}`);
    console.error(`    ${err.message}`);
  }
}

// 1. Valid YouTube watch URL
test('1. Valid YouTube watch URL', () => {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const res = validateExternalVideoUrl(url);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.provider, 'youtube');
  assert.strictEqual(res.videoId, 'dQw4w9WgXcQ');
  assert.strictEqual(res.embedUrl, 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0');
});

// 2. Valid YouTube short URL
test('2. Valid YouTube youtu.be short URL', () => {
  const url = 'https://youtu.be/dQw4w9WgXcQ?t=42';
  const res = validateExternalVideoUrl(url);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.provider, 'youtube');
  assert.strictEqual(res.videoId, 'dQw4w9WgXcQ');
  assert.strictEqual(res.embedUrl, 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0');
});

// 3. Valid YouTube embed URL
test('3. Valid YouTube embed URL', () => {
  const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  const res = validateExternalVideoUrl(url);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.provider, 'youtube');
  assert.strictEqual(res.videoId, 'dQw4w9WgXcQ');
});

// 4. Valid YouTube shorts URL
test('4. Valid YouTube /shorts/ URL', () => {
  const url = 'https://www.youtube.com/shorts/dQw4w9WgXcQ';
  const res = validateExternalVideoUrl(url);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.provider, 'youtube');
  assert.strictEqual(res.videoId, 'dQw4w9WgXcQ');
});

// 5. Invalid YouTube URL (bad ID length or characters)
test('5. Invalid YouTube URL - invalid video ID length', () => {
  const url = 'https://www.youtube.com/watch?v=too_short';
  const res = validateExternalVideoUrl(url);
  assert.strictEqual(res.isValid, false);
});

// 6. Valid Google Drive URL (/file/d/.../view)
test('6. Valid Google Drive /file/d/.../view URL', () => {
  const url = 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing';
  const res = validateExternalVideoUrl(url);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.provider, 'google_drive');
  assert.strictEqual(res.fileId, '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
  assert.strictEqual(res.embedUrl, 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview');
});

// 7. Valid Google Drive query param (?id=...)
test('7. Valid Google Drive ?id=... URL', () => {
  const url = 'https://drive.google.com/open?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
  const res = validateExternalVideoUrl(url);
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.provider, 'google_drive');
  assert.strictEqual(res.fileId, '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
  assert.strictEqual(res.embedUrl, 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview');
});

// 8. Invalid Google Drive URL
test('8. Invalid Google Drive URL (missing file ID)', () => {
  const url = 'https://drive.google.com/drive/my-drive';
  const res = validateExternalVideoUrl(url);
  assert.strictEqual(res.isValid, false);
});

// 9. Provider detection
test('9. Provider detection (youtube vs google_drive vs unknown)', () => {
  const yt = validateExternalVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const gd = validateExternalVideoUrl('https://drive.google.com/file/d/abc12345DEF_-7890/preview');
  const unknown = validateExternalVideoUrl('https://vimeo.com/12345678');
  assert.strictEqual(yt.provider, 'youtube');
  assert.strictEqual(gd.provider, 'google_drive');
  assert.strictEqual(unknown.isValid, false);
  assert.strictEqual(unknown.provider, null);
});

// 10. Rejection of arbitrary malicious iframe injection
test('10. Rejection of arbitrary malicious URLs and javascript: URI', () => {
  const xss = validateExternalVideoUrl('javascript:alert(1)');
  const arbitrary = validateExternalVideoUrl('https://malicious-site.com/video.mp4');
  const malformed = validateExternalVideoUrl('not-a-url');
  assert.strictEqual(xss.isValid, false);
  assert.strictEqual(arbitrary.isValid, false);
  assert.strictEqual(malformed.isValid, false);
});

// 11. Clean URL normalization
test('11. Clean URL normalization preserves canonical provider URLs', () => {
  const res = validateExternalVideoUrl('   https://youtu.be/dQw4w9WgXcQ?feature=share   ');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.cleanUrl, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

console.log(`\nResults: ${passed}/${total} tests passed.`);
if (passed !== total) {
  process.exit(1);
}
