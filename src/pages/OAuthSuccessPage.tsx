import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check standard ?token=XYZ
        const params = new URLSearchParams(window.location.search);
        let token = params.get("token");

        // If backend sends token in hash (#token=XYZ)
        if (!token && window.location.hash) {
            const hashParams = new URLSearchParams(
                window.location.hash.replace("#", "")
            );
            token = hashParams.get("token");
        }

        // If still no token → go back to login
        if (!token) {
            navigate("/auth");
            return;
        }

        // Save token and go to dashboard
        localStorage.setItem("token", token);
        navigate("/dashboard", { replace: true });
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen text-lg">
            Logging you in…
        </div>
    );
}

