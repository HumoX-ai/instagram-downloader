import instagramGetUrl from "instagram-url-direct";
import axios from "axios";

// Instagram videoni yuklab olish uchun funksiya
export async function downloadInstagramContent(url) {
  try {
    const dataList = await instagramGetUrl(url);
    return dataList.url_list;
  } catch (error) {
    console.error("Error:", error);
  }
}

// TikTok videoni yuklab olish uchun funksiya
export async function downloadTikTokContent(url) {
  let errorMessage = "";
  try {
    const response = await axios.request({
      method: "GET",
      url: "https://tiktok-download-without-watermark.p.rapidapi.com/analysis",
      params: {
        url: url,
        hd: "1",
      },
      headers: {
        "x-rapidapi-key": "dedbf2051emshdde11662bde5f9cp14d73fjsnd8e7f8343eef",
        "x-rapidapi-host": "tiktok-download-without-watermark.p.rapidapi.com",
      },
    });
    console.log(response.data.data.hdplay);
    return response.data.data.play;
  } catch (error) {
    errorMessage += "First API attempt failed. ";
    try {
      const response = await axios.request({
        method: "GET",
        url: "https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/index",
        params: {
          url: url,
        },
        headers: {
          "x-rapidapi-key":
            "dedbf2051emshdde11662bde5f9cp14d73fjsnd8e7f8343eef",
          "x-rapidapi-host":
            "tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com",
        },
      });
      console.log(response.data.video[0]);
      return response.data.video[0];
    } catch (error) {
      errorMessage += "Second API attempt failed. ";
      try {
        const response = await axios.request({
          method: "GET",
          url: "https://tiktok-video-no-watermark10.p.rapidapi.com/index/Tiktok/getVideoInfo",
          params: {
            url: url,
            hd: "1",
          },
          headers: {
            "x-rapidapi-key":
              "dedbf2051emshdde11662bde5f9cp14d73fjsnd8e7f8343eef",
            "x-rapidapi-host": "tiktok-video-no-watermark10.p.rapidapi.com",
          },
        });
        console.log(response.data.data.play);
        return response.data.data.play;
      } catch (error) {
        errorMessage += "Third API attempt failed. ";
        throw new Error(errorMessage + "All API attempts failed.");
      }
    }
  } finally {
    if (errorMessage) {
      console.warn(
        "Warning: " + errorMessage + "Some API calls encountered issues."
      );
    }
  }
}
