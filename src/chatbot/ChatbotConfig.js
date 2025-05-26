import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  initialMessages: [
    createChatBotMessage("Hello! How can I help you with donation camps?")
  ],
  botName: "AidBot",
};

export default config;
