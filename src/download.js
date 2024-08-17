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
export async function downloadTikTokContent(url) {
  try {
    // const dataList = await tiktok.tiktokdownload(url);
    // console.log(dataList);
    // return dataList.video;
  } catch (error) {
    console.error("Error:", error);
  }
}
