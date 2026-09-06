/*
  ✨ BIRTHDAY SURPRISE CONFIG
  Edit this file if you want permanent settings in the website.
  The on-screen ⚙️ Drive Setup can also save these settings in your browser.

  IMPORTANT: Google Drive API keys are browser-visible. Restrict the key to
  your website domain and to the Google Drive API.
*/

const CONFIG = {
  personName: "Huthrika",
  birthDate: "2007-09-07",          // YYYY-MM-DD — age is calculated automatically
  birthdayPin: "07092007",          // e.g. 07042005

  character: {
    // You can use GIF / PNG / WebP / JPG here.
    image: "assets/characters/tkthao219-bubududu.gif",
    emoji: "🐰",
    alt: "Cute birthday bunny"
  },

  music: {
    file: "assets/birthday-music.mp3",
    loop: true,
    volume: 0.45,
    fadeInMs: 2200
  },

  googleDrive: {
    apiKey: "AIzaSyCb2l1aOEeTjWiBzu3fHHWxUnhzTW6PpNo",
    parentFolderId: "", // Optional: parent Birthday Surprise folder
    photosFolderId: "169x-gb_uWq-_DRicJ87C2Gsoiq7HtyhG",
    videosFolderId: "1llXARyc5SdPDDtMFo1E6_Fxms1tr8qh_"
  },

  maxPhotos: 30,
  maxVideos: 10
};
