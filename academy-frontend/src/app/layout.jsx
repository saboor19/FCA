import "./globals.css";
import NavbarWrapper from "@/components/public/NavbarWrapper";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/context/AuthContext";
import ConditionalFooter from "@/components/public/ConditionalFooter";
import RoleThemeProvider from "@/components/app/RoleThemeProvider"; // <-- add
import "leaflet/dist/leaflet.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Academy Web App",
  description: "Modern academy management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>
            <RoleThemeProvider> {/* <-- wrap everything */}
              <NavbarWrapper />
              {children}
              <ConditionalFooter />
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  style: {
                    background: "var(--card)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "0",
                    fontFamily: "inherit",
                  },
                }}
              />
            </RoleThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}