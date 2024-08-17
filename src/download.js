import instagramGetUrl from "instagram-url-direct";

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
// export async function downloadTikTokContent(url) {
//   try {
//     const dataList = await FongsiDev_Scraper.TiktokVideo(url);
//     return dataList.data.play;
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }
