import crypto from 'crypto';

export default function getGravatar(email) {
  if (!email) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }

  const md5 = crypto.createHash('md5').update(email).digest('hex');

  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
}
