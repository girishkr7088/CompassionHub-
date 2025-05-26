class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  setChatbotMessage = (message) => {
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleHelp = () => {
    const message = this.createChatBotMessage(
      "You can browse donation camps, register your own camp, contact organizers, or donate items."
    );
    this.setChatbotMessage(message);
  };

  handleViewCamps = () => {
    const message = this.createChatBotMessage("To view available donation camps, go to the 'donation Page' section.");
    this.setChatbotMessage(message);
  };

  handleRegisterCamp = () => {
    const message = this.createChatBotMessage("To register a new camp, Go to NGO Panel, click on the 'Register Camp' button and fill out the form.");
    this.setChatbotMessage(message);
  };

  handleDonateItems = () => {
    const message = this.createChatBotMessage("You can donate food, clothes, or money by visiting the 'Donate' section.");
    this.setChatbotMessage(message);
  };

  handleContact = () => {
    const message = this.createChatBotMessage("Each camp section has organizer contact details at the bottom.");
    this.setChatbotMessage(message);
  };

  handleLocationSearch = () => {
    const message = this.createChatBotMessage("Use the location button to find camp exact location.");
    this.setChatbotMessage(message);
  };

  handleTimings = () => {
    const message = this.createChatBotMessage("Camp timings are listed on each camp card or detail page.");
    this.setChatbotMessage(message);
  };

  defaultResponse = () => {
    const message = this.createChatBotMessage(
      "Sorry, I didn't understand that. Try asking about camps, donations, or contacting organizers."
    );
    this.setChatbotMessage(message);
  };
}

export default ActionProvider;
