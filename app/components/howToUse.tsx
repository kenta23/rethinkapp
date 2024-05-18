const steps = [
    {
      id: 1,
      desc: "1.Sign Up and Unlock Features:",
      sub: "Login or Create a new account. This unlocks features like creating your own AI chat assistants."
    },
    {
      id: 2,
      desc: "2.Craft Your First AI Chat:",
      sub: `Click Create New and give your chatbot a fitting title.`,
      sub2: `To create chat, a minimum of 6 characters is required in order to upload chat Under "Documents," click "Insert New Document" and choose the file you want the AI to analyze. Upload it and wait for processing.`
    },
    {
      id: 3,
      desc:"3.Engage in Conversation",
      sub: `Now, the magic happens! Type your questions directly into the chat window. The AI will scan your document and provide relevant answers and information.`,
      sub2: `Don't hesitate to ask follow-up questions or delve deeper into specific topics. The AI is here to guide you through your document's content.`,
    }, 
    {
      id: 4,
      desc: "5.Explore Existing Chats:",
      sub: `Before building a new chat, check out "Archive" to access all your previous conversations with different AI assistants. This can be a great way to revisit past learning sessions or reuse helpful chatbots.`
    },
  ]


export default function HowToUse() {
    return (
      <>
        <p className="font-medium text-[16px]">
          ReThink: A Simplified Guide ReThink empowers you to build your own AI
          chatbots and have insightful conversations about uploaded documents.
          Here&apos;s a breakdown to get you started:
        </p>
        <br />

        <div className="space-y-2">
          {steps.map((item) => (
            <ul className="space-y-2" key={item.id}>
              <h5>{item.desc}</h5>
              <li className="font-light">{item.sub}</li>
              <li className="font-normal">{item.sub2}</li>
            </ul>
          ))}
        </div>

        <div className="space-y-2 mt-6">
          <h3>PRO TIP:</h3>
          <p>
            Think of your AI chat like a personal research assistant. The more
            specific your questions are, the better it can understand your needs
            and provide tailored answers.
          </p>
        </div>
      </>
    );
}