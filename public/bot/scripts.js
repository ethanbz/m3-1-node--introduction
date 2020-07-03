const messageInput = document.querySelector('#user-input');
const conversationElem = document.querySelector('#conversation-container');
let mode = '';

// focus the input on load
const handleFocus = () => {
  messageInput.focus();
};

// updateConversation expects an object with 'user' and 'text'
const updateConversation = (message) => {
  const { author, text } = message;
  const messageElem = document.createElement('p');

  messageElem.classList.add('message', author);
  messageElem.innerHTML = `<span>${text}</span>`;
  conversationElem.appendChild(messageElem);
  conversationElem.scrollTop = conversationElem.scrollHeight;

  if (author === 'user') messageInput.value = '';
  handleFocus();
};

const getBotMessage = (text) => {
  const commonGreetings = ['hi', 'hello', 'howdy', 'hey'];
  const commonGoodbyes = ['bye', 'goodbye', 'adios', 'ciao'];
  const jokes = ['What does the sign on an out-of-business brothel say? Beat it. We’re closed.', 'Why was the guitar teacher arrested? For fingering a minor.', 'Why does Santa Claus have such a big sack?, He only comes once a year.'];
  let botMsg = '';
  commonGreetings.forEach(greeting => {
    if (text.includes(greeting)) botMsg = 'Hello!';
  });
  if (botMsg === 'Hello!') return botMsg;
  commonGoodbyes.forEach(goodbye => {
    if (text.includes(goodbye)) botMsg = "It's been real, homie. Later.";
  });
  if (botMsg === "It's been real, homie. Later.") return botMsg;
  if (text.toLowerCase().includes('funny')) {
    mode = 'joke';
    return 'Bzzt wanna hear a joke?';
  }
  if (mode === 'joke') {
    mode = '';
    if (text.toLowerCase().includes('yes')) return jokes[Math.round(Math.random()*2)];
    return "Bzzt okay Mr. boring";
  }
  return 'Bzzt ' + text;
}
    

const sendMessage = (event) => {
  event.preventDefault();

  const message = { author: 'user', text: messageInput.value };
  updateConversation(message);

  fetch(`/bot-message/?text=${message.text}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data.message.text = getBotMessage(data.message.text);
      updateConversation(data.message);
    });
};

// call handleFocus on load
handleFocus();
