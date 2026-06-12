import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import {Providers} from "@/components/providers";
import {AuthProvider} from "@/context/AuthContext";

export const metadata = {
  title:"Academy Web App",
  description:"Modern academy management platform"
};

export default function RootLayout({children}) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body>

        <Providers>

          <AuthProvider>

            <AppNavbar />

            {children}

          </AuthProvider>

        </Providers>

      </body>

    </html>
  );
}
