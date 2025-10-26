import { createThirdwebClient } from "thirdweb";

// Shared thirdweb client instance
// This prevents creating multiple client instances throughout the app
export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});
