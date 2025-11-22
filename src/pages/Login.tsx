import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, X, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [adminRegData, setAdminRegData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [loginType, setLoginType] = useState<"user" | "admin">("user"); // user or admin login
  const [showAdminRegForm, setShowAdminRegForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdminRegChange = (field: string, value: string) => {
    setAdminRegData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdminCodeChange = (value: string) => {
    setAdminRegData(prev => ({ ...prev, adminCode: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAdminPasswordVisibility = () => {
    setShowAdminPassword(!showAdminPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = loginType === "admin" 
        ? "http://localhost:5000/api/auth/admin/login" 
        : "http://localhost:5000/api/auth/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Token received:", data.data.token);
        
        // Store user data and token
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("role", data.data.user.role); // Save role to localStorage
        
        console.log("Saved to localStorage:", { token: data.data.token, role: data.data.user.role });
        console.log("Navigating to home");
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.data.user.username}!`,
        });

        // Redirect based on user role after successful login
        if (data.data.user.role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password confirmation check
    if (adminRegData.password !== adminRegData.confirmPassword) {
      toast({
        title: "Admin Registration Failed",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Password strength check
    if (adminRegData.password.length < 6) {
      toast({
        title: "Admin Registration Failed",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingAdmin(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: adminRegData.username,
          email: adminRegData.email,
          password: adminRegData.password,
          admin_code: adminRegData.adminCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Admin Registration Successful",
          description: `Admin account for ${data.data.user.username} created successfully!`,
        });
        setShowAdminRegForm(false);
        setAdminRegData({ username: "", email: "", password: "", confirmPassword: "", adminCode: "" });
      } else {
        toast({
          title: "Admin Registration Failed",
          description: data.message || "An error occurred during admin registration",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Admin registration error:", error);
      toast({
        title: "Admin Registration Failed",
        description: "An error occurred during admin registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-light/10 via-primary/5 to-forest-deep/10 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-primary to-forest-light p-0.5 rounded-2xl shadow-xl">
          <Card className="w-full bg-white rounded-xl overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-forest-light/10 pb-6 pt-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-forest-light/10"></div>
              <div className="relative z-10">
                <div className="mx-auto bg-gradient-to-br from-primary to-forest-light p-4 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 shadow-lg">
                  {showAdminRegForm ? (
                    <Shield className="h-10 w-10 text-white" />
                  ) : loginType === "admin" ? (
                    <Shield className="h-10 w-10 text-white" />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {showAdminRegForm 
                    ? "Admin Registration" 
                    : loginType === "admin" 
                      ? "Admin Login" 
                      : "User Login"}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {showAdminRegForm
                    ? "Create a new admin account (requires admin authentication)"
                    : loginType === "admin" 
                      ? "Access the admin panel" 
                      : "Sign in to your account"}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {!showAdminRegForm ? (
                <>
                  <div className="flex gap-3 mb-6">
                    <Button
                      variant={loginType === "user" ? "default" : "outline"}
                      className="flex-1 py-5 text-base font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                      onClick={() => setLoginType("user")}
                      type="button"
                    >
                      <User className="h-4 w-4 mr-2" />
                      User
                    </Button>
                    <Button
                      variant={loginType === "admin" ? "default" : "outline"}
                      className="flex-1 py-5 text-base font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                      onClick={() => setLoginType("admin")}
                      type="button"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                          className="py-3 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary"
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-forest-light hover:from-primary/90 hover:to-forest-light/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary font-medium underline-offset-4 hover:underline hover:text-forest-light transition-colors">
                      Sign up
                    </Link>
                    <div className="mt-2">
                      <button 
                        onClick={() => setShowAdminRegForm(true)}
                        className="text-primary font-medium underline-offset-4 hover:underline hover:text-forest-light transition-colors text-sm"
                      >
                        Create Admin Account
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Admin Registration Form
                <div className="space-y-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg text-gray-800">Admin Registration</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdminRegForm(false)}
                      className="h-9 w-9 p-0 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <form onSubmit={handleAdminRegistration} className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="admin-username" className="text-gray-700 font-medium">Full Name</Label>
                      <Input
                        id="admin-username"
                        type="text"
                        placeholder="John Doe"
                        value={adminRegData.username}
                        onChange={(e) => handleAdminRegChange("username", e.target.value)}
                        required
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="admin-email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@example.com"
                        value={adminRegData.email}
                        onChange={(e) => handleAdminRegChange("email", e.target.value)}
                        required
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="admin-password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          type={showAdminPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={adminRegData.password}
                          onChange={(e) => handleAdminRegChange("password", e.target.value)}
                          required
                          className="py-3 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary"
                          onClick={toggleAdminPasswordVisibility}
                          aria-label={showAdminPassword ? "Hide password" : "Show password"}
                        >
                          {showAdminPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="admin-confirm-password" className="text-gray-700 font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="admin-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={adminRegData.confirmPassword}
                          onChange={(e) => handleAdminRegChange("confirmPassword", e.target.value)}
                          required
                          className="py-3 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary"
                          onClick={toggleConfirmPasswordVisibility}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="admin-code" className="text-gray-700 font-medium">Admin Code</Label>
                      <Input
                        id="admin-code"
                        type="password"
                        placeholder="Enter admin code"
                        value={adminRegData.adminCode}
                        onChange={(e) => handleAdminCodeChange(e.target.value)}
                        required
                        className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-forest-light hover:from-primary/90 hover:to-forest-light/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={isSubmittingAdmin}
                    >
                      {isSubmittingAdmin ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                          Creating admin...
                        </div>
                      ) : (
                        "Create Admin Account"
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;