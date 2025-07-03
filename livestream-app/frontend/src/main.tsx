import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { StreamTheme } from '@stream-io/video-react-sdk'
import ChatStream from './ChatStream.tsx'

// import the SDK provided styles
import "@stream-io/video-react-sdk/dist/css/styles.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StreamTheme style={{ fontFamily: 'sans-serif', color: 'white' }}>
      <ChatStream />
      <App />
  </StreamTheme>
);