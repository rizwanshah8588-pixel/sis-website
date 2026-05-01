import { useState, useEffect, useRef } from 'react';
import { Play, Heart, Upload, X, Trash2, Video as VideoIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Video {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  featured: boolean;
  liked: boolean;
}

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('lifestyle');
  const [newDuration, setNewDuration] = useState('0:00');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumb, setSelectedThumb] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setVideos(data);
  };

  const featured = videos.find((v) => v.featured);
  const regular = videos.filter((v) => !v.featured);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedVideo(file);
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedThumb(file);
      setThumbPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo) return;
    setUploading(true);

    const fileExt = selectedVideo.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, selectedVideo);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    const videoUrl = urlData.publicUrl;

    let thumbnailUrl = '';
    if (selectedThumb) {
      const thumbExt = selectedThumb.name.split('.').pop();
      const thumbName = `${Date.now()}-thumb-${Math.random().toString(36).slice(2)}.${thumbExt}`;
      const thumbPath = `thumbnails/${thumbName}`;

      await supabase.storage.from('videos').upload(thumbPath, selectedThumb);
      const { data: thumbUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(thumbPath);
      thumbnailUrl = thumbUrlData.publicUrl;
    }

    await supabase.from('videos').insert({
      title: newTitle || 'Untitled',
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      duration: newDuration || '0:00',
      category: newCategory,
      featured: false,
    });

    setNewTitle('');
    setNewCategory('lifestyle');
    setNewDuration('0:00');
    setSelectedVideo(null);
    setSelectedThumb(null);
    setThumbPreview(null);
    setShowUpload(false);
    setUploading(false);
    fetchVideos();
  };

  const deleteVideo = async (id: string) => {
    await supabase.from('videos').delete().eq('id', id);
    fetchVideos();
  };

  const toggleLike = async (id: string, currentLiked: boolean) => {
    await supabase
      .from('videos')
      .update({ liked: !currentLiked })
      .eq('id', id);
    fetchVideos();
  };

  return (
    <section id="videos" className="relative py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-dancing text-pink-400 text-xl mb-2">
            watch and vibe
          </p>
          <h2 className="font-pacifico text-4xl sm:text-5xl text-gradient-barbie mb-4">
            Video Collection
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-rose-300 mx-auto rounded-full" />
        </div>

        {/* Upload button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-quicksand font-semibold text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl hover:scale-105 transition-all"
          >
            <Upload className="w-4 h-4" />
            Add Video
          </button>
        </div>

        {/* Upload modal */}
        {showUpload && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-pink-200/50 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-pacifico text-2xl text-gradient-barbie">
                  Add New Video
                </h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-2 rounded-full hover:bg-pink-50 transition-colors"
                >
                  <X className="w-5 h-5 text-pink-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Video file picker */}
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-pink-200 rounded-2xl p-4 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all"
                >
                  <VideoIcon className="w-8 h-8 text-pink-300 mx-auto mb-2" />
                  <p className="font-quicksand text-pink-400 text-sm">
                    {selectedVideo ? selectedVideo.name : 'Click to select a video'}
                  </p>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                </div>

                {/* Thumbnail picker */}
                <div
                  onClick={() => thumbInputRef.current?.click()}
                  className="border-2 border-dashed border-pink-200 rounded-2xl p-4 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all"
                >
                  {thumbPreview ? (
                    <img
                      src={thumbPreview}
                      alt="Thumbnail preview"
                      className="max-h-32 mx-auto rounded-xl object-cover"
                    />
                  ) : (
                    <p className="font-quicksand text-pink-300 text-sm py-2">
                      Add a thumbnail (optional)
                    </p>
                  )}
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbSelect}
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <input
                  type="text"
                  placeholder="Video title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/50 font-quicksand text-pink-700 placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                />

                {/* Duration */}
                <input
                  type="text"
                  placeholder="Duration (e.g. 5:30)"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/50 font-quicksand text-pink-700 placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                />

                {/* Category */}
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/50 font-quicksand text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                >
                  <option value="lifestyle">Lifestyle</option>
                  <option value="aesthetic">Aesthetic</option>
                  <option value="selfcare">Self Care</option>
                  <option value="fashion">Fashion</option>
                </select>

                {/* Upload button */}
                <button
                  onClick={handleUpload}
                  disabled={!selectedVideo || uploading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-quicksand font-bold text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Upload Video'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Featured video */}
        {featured && (
          <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-pink-200/50 group cursor-pointer">
            <div className="aspect-video overflow-hidden">
              {featured.video_url.includes('pexels') ? (
                <img
                  src={featured.thumbnail_url || featured.video_url}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <video
                  src={featured.video_url}
                  poster={featured.thumbnail_url || undefined}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/70 via-pink-900/20 to-transparent" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-pink-400/30 rounded-full animate-pulse-pink" />
                <div className="relative w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-pink-500 ml-1" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-block px-3 py-1 rounded-full bg-pink-500/80 text-white text-xs font-quicksand font-semibold mb-3">
                Featured
              </span>
              <h3 className="font-pacifico text-2xl sm:text-3xl text-white mb-2">
                {featured.title}
              </h3>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteVideo(featured.id);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Video grid */}
        {regular.length === 0 && !featured ? (
          <div className="text-center py-16">
            <VideoIcon className="w-16 h-16 text-pink-200 mx-auto mb-4" />
            <p className="font-dancing text-pink-300 text-2xl">
              No videos yet... add some!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((video) => (
              <div
                key={video.id}
                className="group rounded-2xl overflow-hidden shadow-lg shadow-pink-100/30 border border-pink-50 card-hover cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  {video.video_url.includes('pexels') ? (
                    <img
                      src={video.thumbnail_url || video.video_url}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={video.video_url}
                      poster={video.thumbnail_url || undefined}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-pink-500 ml-0.5" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-quicksand font-medium">
                    {video.duration}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteVideo(video.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-pink-400" />
                  </button>
                </div>

                <div className="p-4 bg-gradient-to-br from-white to-pink-50/50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-quicksand font-semibold text-pink-800 text-sm leading-snug mb-1">
                        {video.title}
                      </h3>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-pink-100 text-pink-500 text-xs font-quicksand font-medium capitalize">
                        {video.category}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(video.id, video.liked);
                      }}
                      className="p-1.5 rounded-full hover:bg-pink-100 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          video.liked
                            ? 'text-pink-500 fill-pink-500'
                            : 'text-pink-300 hover:text-pink-500'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
