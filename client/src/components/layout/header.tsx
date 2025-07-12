import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, SquareStack } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <SquareStack className="text-stackit-blue text-2xl mr-2" size={32} />
            <span className="text-xl font-bold text-gray-900">StackIt</span>
          </Link>

          {/* Search Bar */}
          <div className={`flex-1 max-w-lg ${isMobile ? "mx-4" : "mx-8"}`}>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 focus:ring-stackit-blue focus:border-transparent"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <Bell size={20} />
                    <Badge className="absolute -top-1 -right-1 bg-stackit-red text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                      3
                    </Badge>
                  </Button>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <Link href={`/profile/${user?.id}`}>
                    <Button variant="ghost" size="sm" className="text-stackit-blue hover:text-stackit-blue-dark">
                      {user?.username}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-stackit-blue hover:text-stackit-blue-dark font-medium">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-stackit-blue text-white hover:bg-stackit-blue-dark">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
