
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Radio, RadioIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const LiveStreamManager = () => {
  const [streams, setStreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStream, setEditingStream] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stream_url: '',
    thumbnail_url: '',
    is_active: false
  });

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStreams(data || []);
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStream) {
        const { error } = await supabase
          .from('live_streams')
          .update(formData)
          .eq('id', editingStream.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Live stream updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('live_streams')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Live stream created successfully.",
        });
      }

      setShowForm(false);
      setEditingStream(null);
      setFormData({
        title: '',
        description: '',
        stream_url: '',
        thumbnail_url: '',
        is_active: false
      });
      fetchStreams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (stream: any) => {
    setEditingStream(stream);
    setFormData({
      title: stream.title,
      description: stream.description || '',
      stream_url: stream.stream_url,
      thumbnail_url: stream.thumbnail_url || '',
      is_active: stream.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (streamId: string) => {
    if (!confirm('Are you sure you want to delete this live stream?')) return;

    try {
      const { error } = await supabase
        .from('live_streams')
        .delete()
        .eq('id', streamId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Live stream deleted successfully.",
      });
      
      fetchStreams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleStreamStatus = async (streamId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('live_streams')
        .update({ is_active: !currentStatus })
        .eq('id', streamId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Stream ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });
      
      fetchStreams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading live streams...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Live Stream Management</h2>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingStream(null);
            setFormData({
              title: '',
              description: '',
              stream_url: '',
              thumbnail_url: '',
              is_active: false
            });
          }}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Stream
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingStream ? 'Edit Live Stream' : 'Create New Live Stream'}</CardTitle>
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
                <label className="block text-sm font-medium mb-2">Stream URL</label>
                <Input
                  value={formData.stream_url}
                  onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
                  placeholder="https://www.facebook.com/..."
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

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Stream is active
                </label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  {editingStream ? 'Update Stream' : 'Create Stream'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingStream(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => (
          <Card key={stream.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={stream.is_active ? "default" : "secondary"}>
                    {stream.is_active ? (
                      <>
                        <Radio className="h-3 w-3 mr-1" />
                        Live
                      </>
                    ) : (
                      <>
                        <RadioIcon className="h-3 w-3 mr-1" />
                        Offline
                      </>
                    )}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStreamStatus(stream.id, stream.is_active)}
                    className={stream.is_active ? "text-red-600" : "text-green-600"}
                  >
                    {stream.is_active ? 'Stop' : 'Start'}
                  </Button>
                </div>

                {stream.thumbnail_url && (
                  <img
                    src={stream.thumbnail_url}
                    alt={stream.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}

                <div>
                  <h3 className="font-semibold text-lg">{stream.title}</h3>
                  {stream.description && (
                    <p className="text-gray-600 text-sm mt-1">{stream.description}</p>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Created: {new Date(stream.created_at).toLocaleDateString()}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(stream)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(stream.id)}>
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
