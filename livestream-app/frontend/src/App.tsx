import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { CustomLivestreamPlayer } from "./CustomLivestreamPlayer";

const apiKey = "6dn6xjzdu5sf";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiRXNoYW5rIn0.N_cVO-ZvgNU3V0mpXBMcWx4rqt1VpvjygRr79lJ0-fE";
const callId = "6264442256";

const user: User = { id: 'Eshank' };
const client = new StreamVideoClient({ apiKey, user, token });

export default function App() {
  return (
    <StreamVideo client={client}>
      <CustomLivestreamPlayer callType="livestream" callId={callId} />
    </StreamVideo>
  );
}