
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const VideoManager = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    video_type: 'youtube',
    thumbnail_url: '',
    category_id: '',
    state_id: ''
  });

  useEffect(() => {
    fetchVideos();
    fetchCategories();
    fetchStates();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          categories(name),
          states(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  };

  const fetchStates = async () => {
    const { data } = await supabase.from('states').select('*').order('name');
    setStates(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update(formData)
          .eq('id', editingVideo.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Video updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Video created successfully.",
        });
      }

      setShowForm(false);
      setEditingVideo(null);
      setFormData({
        title: '',
        description: '',
        video_url: '',
        video_type: 'youtube',
        thumbnail_url: '',
        category_id: '',
        state_id: ''
      });
      fetchVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      video_url: video.video_url,
      video_type: video.video_type,
      thumbnail_url: video.thumbnail_url || '',
      category_id: video.category_id || '',
      state_id: video.state_id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted successfully.",
      });
      
      fetchVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading videos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Video Management</h2>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingVideo(null);
            setFormData({
              title: '',
              description: '',
              video_url: '',
              video_type: 'youtube',
              thumbnail_url: '',
              category_id: '',
              state_id: ''
            });
          }}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Video
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL</label>
                  <Input
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Video Type</label>
                  <Select value={formData.video_type} onValueChange={(value) => setFormData({ ...formData, video_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <Select value={formData.state_id} onValueChange={(value) => setFormData({ ...formData, state_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  {editingVideo ? 'Update Video' : 'Add Video'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingVideo(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Play className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{video.video_type}</span>
                    <span>•</span>
                    <span>{video.categories?.name || 'No category'}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(video.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
