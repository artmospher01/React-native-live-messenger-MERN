import StackNavigator from "./StackNavigator";
import { UserProvider } from "./context/userContext";

export default function App() {
  return (
    <UserProvider>
      <StackNavigator />
    </UserProvider>
  );
}
