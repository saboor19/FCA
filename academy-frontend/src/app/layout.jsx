import "./globals.css";
import AppNavbar from "@/components/public/AppNavbar";
import {Providers} from "@/components/providers";
import {AuthProvider} from "@/context/AuthContext";
import ConditionalFooter from "@/components/public/ConditionalFooter";
import "leaflet/dist/leaflet.css";
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

          <ConditionalFooter />

          </AuthProvider>

        </Providers>

      </body>

    </html>
  );
}
