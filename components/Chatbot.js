import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faComments, faTimes } from '@fortawesome/free-solid-svg-icons';

const Chatbot = ({ eventChatData, eventName, eventPrice, eventnumberOfTicketsAvailable, eventStartDate, eventEndDate, eventAddress }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
console.log ({ eventChatData, eventName, eventPrice, eventnumberOfTicketsAvailable, eventStartDate, eventEndDate, eventAddress })

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    const language = /[\u0600-\u06FF]/.test(input) ? 'arabic' : 'english';

    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        model: "gpt-3.5-turbo-instruct",
        prompt: `
        Answer based on the following
        Event Details:
          - Event Name: ${eventName}
          - Price: ${eventPrice} 
          - Number of Tickets Available: ${eventnumberOfTicketsAvailable} 
          - Start Date: ${eventStartDate}
          - End Date: ${eventEndDate}
          - Address: ${eventAddress}
          - Chat Data: ${eventChatData}

       the user asked question: "${input}". Note: Please Answer in Arabic if the question is in Arabic.`,
        max_tokens: 150,
      }, {
        headers: {
          'Authorization': `Bearer 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`
        }
      });
      setMessages(prev => [...prev, { type: 'bot', text: response.data.choices[0].text }]);
    } catch (error) {
      console.error('Error while fetching response:', error);
      setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <div style={styles.toggleButton} onClick={toggleChatbot}>
          <FontAwesomeIcon icon={faComments} size="2x" />
        </div>
      )}
      {isOpen && (
        <div style={styles.chatbot} className="chat-bot-c">
          <div style={styles.header}>
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjK_KUycTsd1UDiUSNvxjcrb2McjD5Ov_PdW2dQjQPbqHoTnviRaKjD1ZUPJ9u1Z9AWyWA5EIfY-YxEF-ePwynZjiSGrlO3weBVKeBu1XNs_H0JprOzQFPiqsHnX-YD5ffQ1fO9CZGfyLEt9MHIGcS1qBeWBHCsqkcWgp9Suj2uo3xoLd-4xQfNCcS55Ms/s320/20240201_093035_0000.png"
              alt="Avatar"
              style={styles.headerImage}
            />
            <div style={styles.chatTitle}>Chat Bot&nbsp;</div>
            <i className="fas fa-circle" style={styles.icon}></i>
            <FontAwesomeIcon icon={faTimes} style={styles.closeIcon} onClick={toggleChatbot} />
          </div>
          <div style={styles.chatContainer}>
            {messages.map((msg, index) => (
              <div key={index} style={{ ...styles.message, ...styles[msg.type] }}>
                <div style={styles.messageContent}>{msg.text}</div>
              </div>
            ))}
          </div>
          <div style={styles.messageInput}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="chat with service provider..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.button}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  toggleButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#0E063A',
    color: 'white',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 1000,
  },
  chatbot: {
    position: 'fixed',
    bottom: '30px',
    right: '20px',
    width: '300px',
    maxHeight: '400px',
    backgroundColor: 'white',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  closeIcon: {
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  header: {
    backgroundColor: '#0E063A',
    color: 'white',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  headerImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
    marginRight: '10px',
    flexShrink: 0,
  },
  chatTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: '5px',
    animation: 'pulse 1s infinite',
  },
  chatContainer: {
    maxWidth: '400px',
    margin: '20px auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  message: {
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '10px',
    maxWidth: '70%',
    display: 'flex',
    alignItems: 'center',
  },
  user: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  bot: {
    backgroundColor: '#e4e4e4',
    justifyContent: 'flex-start',
  },
  messageContent: {
    wordWrap: 'break-word',
  },
  messageInput: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
  },
  input: {
    padding: '8px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    outline: 'none',
    color: 'black',
  },
  button: {
    backgroundColor: '#0E063A',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    marginLeft: '5px',
    borderRadius: '50%',
    cursor: 'pointer',
    width: '50px',
  },
  buttonHover: {
    backgroundColor: '#673ab7',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.2)' },
    '100%': { transform: 'scale(1)' },
  },
};

export default Chatbot;
