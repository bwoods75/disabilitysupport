const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatHistory = document.getElementById('chat-history');

async function sendMessageToBackend(message) {
  try {
    const response = await fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error:', error);
    return 'There was an error communicating with the server.';
  }
}

sendButton.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (!message) return;

  userInput.value = ''; // Clear input field after sending message

  displayMessage(message, 'user-message');

  const response = await sendMessageToBackend(message);
  displayMessage(response, 'gemini-message');
});

function displayMessage(message, className) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.classList.add(className);
  chatHistory.appendChild(messageElement);
  chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
}
