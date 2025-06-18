
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface CategorySectionProps {
  category: any;
  articles: any[];
}

export const CategorySection = ({ category, articles }: CategorySectionProps) => {
  if (articles.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-red-600 pb-2">
          {category.name}
        </h2>
        <Link
          to={`/category/${category.slug}`}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <Link key={article.id} to={`/article/${article.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                {article.featured_image_url && (
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      {category.name}
                    </Badge>
                    {article.is_breaking && (
                      <Badge variant="destructive">Breaking</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-gray-600 text-sm line-clamp-2">{article.summary}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
