function isValidInstagramUrl(url) {
  const instagramUrlPattern =
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s/]+\/[^\s/]+\/?/;
  return instagramUrlPattern.test(url);
}

function isValidTikTokUrl(url) {
  const tikTokUrlPattern = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?/;
  return tikTokUrlPattern.test(url);
}

module.exports = { isValidInstagramUrl, isValidTikTokUrl };
