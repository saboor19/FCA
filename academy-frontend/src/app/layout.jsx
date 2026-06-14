import "./globals.css";
import AppNavbar from "@/components/public/AppNavbar";
import {Providers} from "@/components/providers";
import {AuthProvider} from "@/context/AuthContext";
import Footer from "@/components/public/Footer";
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

          <Footer />

          </AuthProvider>

        </Providers>

      </body>

    </html>
  );
}
