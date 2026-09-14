"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { isStandaloneLanderPath } from "@/lib/standalone-landers";

export function DeferredFooter() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isStandaloneLanderPath(pathname)) {
            return;
        }
        if (mounted) return;

        const mountFooter = () => setMounted(true);
        const onScroll = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                mountFooter();
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [pathname, mounted]);

    if (isStandaloneLanderPath(pathname)) {
        return null;
    }

    return mounted ? <Footer /> : null;
}
