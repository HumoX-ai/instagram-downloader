const instagramDl = require("@sasmeee/igdl");
const { alldl } = require("rahad-all-downloader");

async function downloadInstagramVideo(url) {
  try {
    const dataList = await instagramDl(url);
    const downloadLink = dataList[0]?.download_link;
    console.log(downloadLink);
    return downloadLink;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function downloadTikTokVideo(url) {
  try {
    const result = await alldl(url);
    console.log(result.data.videoUrl);
    return result.data.videoUrl;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = { downloadInstagramVideo, downloadTikTokVideo };
