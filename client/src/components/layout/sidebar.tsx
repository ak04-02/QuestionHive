import { Link, useLocation } from "wouter";
import { Home, HelpCircle, Tags, Users, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-context";
import { useQuery } from "@tanstack/react-query";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: popularTags } = useQuery({
    queryKey: ["/api/tags/popular"],
  });

  const isActive = (path: string) => location === path;

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <nav className="bg-white rounded-lg shadow-sm border p-4">
        <div className="space-y-2">
          <Link href="/">
            <div className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/") 
                ? "text-stackit-blue bg-blue-50" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}>
              <Home className="mr-3" size={16} />
              Home
            </div>
          </Link>
          
          <Link href="/">
            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <HelpCircle className="mr-3" size={16} />
              Questions
            </div>
          </Link>
          
          <Link href="/tags">
            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <Tags className="mr-3" size={16} />
              Tags
            </div>
          </Link>
          
          <Link href="/users">
            <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <Users className="mr-3" size={16} />
              Users
            </div>
          </Link>
          
          {user?.role === "admin" && (
            <Link href="/admin">
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Settings className="mr-3" size={16} />
                Admin
              </div>
            </Link>
          )}
        </div>
      </nav>

      {/* Popular Tags */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags?.map((tag: any) => (
            <Badge 
              key={tag.id} 
              variant="secondary" 
              className="cursor-pointer hover:bg-blue-100 hover:text-blue-800"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </aside>
  );
}
