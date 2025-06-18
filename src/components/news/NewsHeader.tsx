
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, User } from 'lucide-react';

interface NewsHeaderProps {
  categories: any[];
}

export const NewsHeader = ({ categories }: NewsHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b-2 border-red-600">
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>{new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth" className="hover:text-red-200">Login</Link>
              <Link to="/newsletter" className="hover:text-red-200">Newsletter</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-red-600 text-white p-2 rounded-lg">
              <span className="font-bold text-xl">VOB</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-600">Voice Of Bharat</h1>
              <p className="text-sm text-gray-600">भारत की आवाज़</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bg-red-600 hover:bg-red-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-col md:flex-row md:items-center py-4 space-y-2 md:space-y-0 md:space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Home
              </Link>
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                to="/videos"
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Videos
              </Link>
              <Link
                to="/live"
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Live
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t p-4`}>
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1 bg-red-600 hover:bg-red-700"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
};
