"use client";

import { usePathname } from "next/navigation";
import AppNavbar from "./AppNavbar";

export default function NavbarWrapper() {

    const pathname = usePathname();

    const hiddenRoutes = [
        "/sales"
    ];

    const hideNavbar = hiddenRoutes.some(route =>
        pathname.startsWith(route)
    );

    if (hideNavbar) {
        return null;
    }

    return <AppNavbar />;

}