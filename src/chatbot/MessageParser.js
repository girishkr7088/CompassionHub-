class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase();

    if (lower.includes("help")) {
      this.actionProvider.handleHelp();
    } else if (lower.includes("view") || lower.includes("see camps")) {
      this.actionProvider.handleViewCamps();
    } else if (lower.includes("register") || lower.includes("add camp")) {
      this.actionProvider.handleRegisterCamp();
    } else if (lower.includes("donate") || lower.includes("donation")) {
      this.actionProvider.handleDonateItems();
    } else if (lower.includes("contact") || lower.includes("organizer")) {
      this.actionProvider.handleContact();
    } else if (lower.includes("location") || lower.includes("nearby")) {
      this.actionProvider.handleLocationSearch();
    } else if (lower.includes("time") || lower.includes("timing")) {
      this.actionProvider.handleTimings();
    } else {
      this.actionProvider.defaultResponse();
    }
  }
}

export default MessageParser;
