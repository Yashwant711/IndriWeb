import { useEffect, useState, useRef } from "react";
import {
  Call,
  ParticipantView,
  StreamCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";

export const CustomLivestreamPlayer = (props: {
  callType: string;
  callId: string;
}) => {
  const { callType, callId } = props;
  const client = useStreamVideoClient();
  
  const [call, setCall] = useState<Call>();
  useEffect(() => {
    if (!client) return;
    const myCall = client.call(callType, callId);
    setCall(myCall);
    myCall.join().catch((e) => {
      console.error("Failed to join call", e);
    });
    return () => {
      myCall.leave().catch((e) => {
        console.error("Failed to leave call", e);
      });
      setCall(undefined);
    };
  }, [client, callId, callType]);

  if (!call) return null;
  return (
    <StreamCall call={call}>
      <CustomLivestreamLayout />
    </StreamCall>
  );
};

const CustomLivestreamLayout = () => {
  const { useParticipants, useParticipantCount } = useCallStateHooks();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const participantCount = useParticipantCount();
  const [firstParticipant] = useParticipants();

  function dataURLToBlob(dataURL: string) {

    // Split the dataURL into header and base64 string
    const parts = dataURL.split(',');
    if (parts.length !== 2) {
      console.error('Invalid data URL format:', dataURL);
      return null; // or throw an error
    }

    const header = parts[0];
    const base64String = parts[1];

    if(!header){
      return null;
    }

    const mimeMatch = header.match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
      console.error('Could not extract MIME type from header:', header);
      return null; // or throw an error
    }

    const mime = mimeMatch[1];
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  const sendFrameToServer = async () => {
    if (!videoRef.current || !canvasRef.current) return;
  
    // Get video and canvas elements
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const ctx = canvasElement.getContext("2d");
  
    if (!ctx) return;
  
    // Set the canvas dimensions to match the video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
  
    // Draw the current video frame onto the canvas
    ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
  
    // Convert canvas content to a base64 image
    const imageData = canvasElement.toDataURL("image/jpeg");
    const imageBlob = dataURLToBlob(imageData);

    // Create FormData and append the image Blob
    const formData = new FormData();
    if(!imageBlob){
      return null;
    }
    formData.append('image', imageBlob, 'image.jpg');
  
    try {
      // Send the image to the Flask server
      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        body: formData
      });
  
      const detections = await response.json();  // Get the detections from the server
  
      // Clear the canvas (optional if you want to overwrite the video)
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  
      // Redraw the video frame
      ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
  
      // Draw the detections on the canvas
      detections.forEach((detection: { bbox: any; confidence: any; class: any; }) => {
        const { bbox, confidence, class: className } = detection;
        const [x_min, y_min, x_max, y_max] = bbox;
  
        // Draw bounding box
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x_min, y_min, x_max - x_min, y_max - y_min);
  
        // Draw label
        ctx.fillStyle = "red";
        ctx.font = "18px Arial";
        ctx.fillText(`${className} (${(confidence * 100).toFixed(1)}%)`, x_min, y_min - 10);
      });
  
    } catch (error) {
      console.error("Error sending frame to the server:", error);
    }
  };
  


  useEffect(() => {
    const interval = setInterval(sendFrameToServer, 1000); // Send frame every 500ms (adjust as needed)
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px", height: "90vh", width: "auto" }}>
      <div style={{color:'black'}}>Live: {participantCount}</div>
      {firstParticipant ? (
        <>
        <div style={{ position: 'relative', maxHeight: '100%', overflow: 'hidden' }}>
          <ParticipantView 
            participant={firstParticipant}
            refs={{
              setVideoElement: (el) => (videoRef.current = el)
            }}
          />
          <div style={{
            width:'100%',
            height: '100%',
            backgroundColor: 'black',
            position:'absolute',
            top:  0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <canvas 
            ref={canvasRef}
            style={{
              height: '100%', // Full height of the parent
              width: 'auto', // Maintain aspect ratio
              maxWidth: '100%', // Prevent overflow if canvas is wider than the parent
          }} 
          />
          </div>
        </div>
        </>
      ) : (
        <>
        <div style={{ color: 'black', border: '1px solid black', textAlign: 'center', padding: '1vw', fontSize: '2vw', fontWeight: 'bold'}}>The host hasn't joined yet</div>
        </>
      )}
    </div>
  );
};