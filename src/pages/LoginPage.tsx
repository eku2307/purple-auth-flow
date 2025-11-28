import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
    const [upiId, setUpiId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async () => {
        if (!upiId || !password) {
            toast({ title: "Enter UPI ID and password", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ upiId, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                toast({ title: "Logged in successfully!" });
                navigate("/dashboard");
            } else {
                toast({ title: data.message || "Login failed", variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Login error", variant: "destructive" });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Google Login → correct OAuth start URL
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
            <Card className="p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <label className="block mb-1">UPI ID</label>
                <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourupi@bank"
                    className="w-full border px-3 py-2 rounded mb-4"
                />

                <label className="block mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full border px-3 py-2 rounded mb-4"
                />

                <Button onClick={handleLogin} disabled={loading} className="w-full mb-4">
                    {loading ? "Logging in..." : "Login with UPI"}
                </Button>

                <div className="text-center my-2 font-semibold">or</div>

                <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
                    Login with Google
                </Button>
            </Card>
        </div>
    );
}
