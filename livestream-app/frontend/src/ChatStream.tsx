import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const ChatStream: React.FC = () => {

  const [message, setMessage] = useState<string>('Loading...');
  const [allMessages, setAllMessages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {

    const fetchMessage = async () => {
      try{
        const response = await fetch('http://localhost:3000/message');
        const data = await response.json();
        setMessage(data.message);

        // If recording is active, save the message to allMessages
        if (isRecording) {
          setAllMessages((prevMessages) => [...prevMessages, data.message]);
        }

      }
      catch (error) {
        console.error('Error fetching the message:', error);
        setMessage('Error fetching the message');
      }
    }

    const intervalId = setInterval(fetchMessage, 1000);

    return () => clearInterval(intervalId);

  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setAllMessages([]);
  };

  const saveMessagesToPDF = () => {
    if (allMessages.length === 0) {
      alert('No messages to save. Please start recording first!');
      return;
    }

    const doc = new jsPDF();
    handleStopRecording();

    doc.setFontSize(10);
    const pageHeight = doc.internal.pageSize.height; // Get the page height
    let verticalPosition = 10; // Start position for the first message

    allMessages.forEach((msg, index) => {

      const mq2Match = msg.match(/MQ2 Reading: (\w+)/);
      let mq2Value = mq2Match ? mq2Match[1] : 'ERROR';

      // Determine if the MQ2 reading is an error, not an integer, or greater than 200
      if (mq2Value === 'ERROR' || isNaN(parseInt(mq2Value)) || parseInt(mq2Value) > 200) {
        doc.setTextColor(255, 0, 0); // Set text color to red
      } else {
        doc.setTextColor(0, 0, 0); // Set text color to black
      }

     // Check if the next line will fit on the current page
     if (verticalPosition + 10 > pageHeight) { // 10 is the line height
      doc.addPage(); // Add a new page
      verticalPosition = 10; // Reset vertical position for the new page
    }

    // Add the message to the PDF
    doc.text(msg, 10, verticalPosition); // Adjust position for each message
    verticalPosition += 10; // Move down for the next message
    });

    doc.save('readings.pdf');

  }

  return (
    <div style={{flex: '1', border: '5px', width: '100vw', textAlign:'center', color:'black', padding:'0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <p style={{width: '80vw', margin: 0}}>{message}</p>
      <button onClick={handleStartRecording} style={{ marginTop: '10px', marginRight: '5px' }}>
        Start PDF
      </button>
      <button onClick={saveMessagesToPDF} style={{ marginTop: '10px' }}>
        Save PDF
      </button>
    </div>
  );
};

export default ChatStream;
