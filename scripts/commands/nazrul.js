const axios = require("axios");

module.exports = {
  config: {
    name: "nazrul",
    version: "1.0",
    credit: "Nazrul",
    prefix: 'awto',
    description: "gemeini ai",
    cooldowns: 5,
    permission: 0,
    category: "google",
    usages: {
      en: "{pn} message | photo reply",
    },
  },
  run: async ({ api, args, event }) => {
    const prompt = args.join(" ");
    //---- Image Reply -----//
    if (event.type === "message_reply") {
      var t = event.messageReply.attachments[0].url;
      try {
       const res = await axios.post('https://geminipro-3rhs.onrender.com/chat-with-gemini', {
                modelType: 'text_and_image',
                prompt: prompt || '',
                imageParts: [t]
            });
            const mgs = res.data.result;
        api.sendMessage(mgs, event.threadID, event.messageID);
      } catch (error) {
        console.error("Error:", error.message);
        api.sendMessage(error, event.threadID, event.messageID);
      }
    }
    //---------- Message Reply ---------//
    else if (!prompt) {
      return api.sendMessage(
        "দয়া করে একটা ফটোতে রিপ্লাই দিন",
        event.threadID,
        event.messageID,
      );
    } else {
      try {
       const res = await axios.post('https://geminipro-3rhs.onrender.com/chat-with-gemini', {
                modelType: 'text_only',
                prompt: prompt
            });
            const mgs = res.data.result;
        api.sendMessage(mgs, event.threadID, event.messageID);
      } catch (error) {
        console.error("Error calling Gemini AI:", error);
        api.sendMessage(
          `Sorry, there was an error processing your request.${error}`,
          event.threadID,
          event.messageID,
        );
      }
    }
  },
};