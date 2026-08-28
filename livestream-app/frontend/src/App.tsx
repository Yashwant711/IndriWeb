import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { CustomLivestreamPlayer } from "./CustomLivestreamPlayer";

const apiKey = "";
const token = "";
const callId = "";

const user: User = { id: 'Eshank' };
const client = new StreamVideoClient({ apiKey, user, token });

export default function App() {
  return (
    <StreamVideo client={client}>
      <CustomLivestreamPlayer callType="livestream" callId={callId} />
    </StreamVideo>
  );
}