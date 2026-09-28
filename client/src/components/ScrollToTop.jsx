import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            try {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            } catch {
                try {
                    window.scrollTo(0, 0);
                } catch {
                    // Safe fallback for environments where window.scrollTo is not implemented
                }
            }
        } else {
            const id = hash.replace("#", "");
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [pathname, hash]);

    return null;
}
