import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract token and user info from URL params
        const token = searchParams.get("token");
        const id = searchParams.get("id");
        const username = searchParams.get("username");
        const email = searchParams.get("email");
        const roles = searchParams.get("roles");

        if (!token || !id || !email) {
          throw new Error("Missing authentication parameters");
        }

        // Construct user info object
        const userInfo = {
          token,
          type: "Bearer",
          id,
          username: username || "",
          email,
          roles: roles ? roles.split(",") : [],
        };

        // Store auth data
        authService.handleOAuthCallback(token, userInfo);

        // Update auth context by logging in with the token
        // We'll simulate this by setting the user directly
        window.location.href = "/";

        toast({
          title: "Success!",
          description: "You've successfully signed in with Google.",
        });
      } catch (error: any) {
        toast({
          title: "Authentication Failed",
          description: error.message || "Failed to complete Google sign in",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
