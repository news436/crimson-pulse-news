
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye } from 'lucide-react';

interface FeaturedArticlesProps {
  articles: any[];
}

export const FeaturedArticles = ({ articles }: FeaturedArticlesProps) => {
  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-2">
        Featured Stories
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Featured Article */}
        <div className="lg:col-span-2">
          <Link to={`/article/${mainArticle.slug}`}>
            <Card className="hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
              {mainArticle.featured_image_url && (
                <div className="relative">
                  <img
                    src={mainArticle.featured_image_url}
                    alt={mainArticle.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {mainArticle.categories && (
                      <Badge className="bg-red-600 hover:bg-red-700">
                        {mainArticle.categories.name}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3 leading-tight">
                  {mainArticle.title}
                </h3>
                {mainArticle.summary && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {mainArticle.summary}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(mainArticle.published_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>2.5k views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Side Articles */}
        <div className="space-y-6">
          {sideArticles.map((article) => (
            <Link key={article.id} to={`/article/${article.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    {article.featured_image_url && (
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {article.categories && (
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            {article.categories.name}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold line-clamp-2 mb-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(article.published_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
