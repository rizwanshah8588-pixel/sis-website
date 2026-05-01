import { useState, useEffect, useRef } from 'react';
import { Heart, X, ChevronLeft, ChevronRight, Upload, ImagePlus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Photo {
  id: string;
  title: string;
  image_url: string;
  category: string;
  liked: boolean;
}

const categories = ['all', 'nature', 'aesthetic', 'dreamy'];

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filter, setFilter] = useState('all');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('aesthetic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      setPhotos(data);
      const likedIds = data.filter((p: Photo) => p.liked).map((p: Photo) => p.id);
      setLiked(new Set(likedIds));
    }
  };

  const filtered =
    filter === 'all' ? photos : photos.filter((p) => p.category === filter);

  const toggleLike = async (id: string) => {
    const newLiked = new Set(liked);
    const isLiked = newLiked.has(id);
    if (isLiked) newLiked.delete(id);
    else newLiked.add(id);
    setLiked(newLiked);

    await supabase
      .from('photos')
      .update({ liked: !isLiked })
      .eq('id', id);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    await supabase.from('photos').insert({
      title: newTitle || 'Untitled',
      image_url: imageUrl,
      category: newCategory,
    });

    setNewTitle('');
    setNewCategory('aesthetic');
    setSelectedFile(null);
    setPreview(null);
    setShowUpload(false);
    setUploading(false);
    fetchPhotos();
  };

  const deletePhoto = async (id: string) => {
    await supabase.from('photos').delete().eq('id', id);
    fetchPhotos();
  };

  const navigateLightbox = (dir: number) => {
    if (lightbox === null) return;
    const idx = filtered.findIndex((p) => p.id === lightbox);
    const next = (idx + dir + filtered.length) % filtered.length;
    setLightbox(filtered[next].id);
  };

  return (
    <section id="gallery" className="relative py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-dancing text-pink-400 text-xl mb-2">
            captured moments
          </p>
          <h2 className="font-pacifico text-4xl sm:text-5xl text-gradient-barbie mb-4">
            Photo Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-rose-300 mx-auto rounded-full" />
        </div>

        {/* Upload button + Filter tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full font-quicksand font-semibold text-sm capitalize transition-all duration-300 ${
                  filter === cat
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-300/50'
                    : 'bg-pink-50 text-pink-400 hover:bg-pink-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-quicksand font-semibold text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl hover:scale-105 transition-all"
          >
            <Upload className="w-4 h-4" />
            Add Photo
          </button>
        </div>

        {/* Upload modal */}
        {showUpload && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-pink-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-pacifico text-2xl text-gradient-barbie">
                  Add New Photo
                </h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-2 rounded-full hover:bg-pink-50 transition-colors"
                >
                  <X className="w-5 h-5 text-pink-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* File picker */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-xl object-cover"
                    />
                  ) : (
                    <div className="py-4">
                      <ImagePlus className="w-10 h-10 text-pink-300 mx-auto mb-2" />
                      <p className="font-quicksand text-pink-400 text-sm">
                        Click to select a photo
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <input
                  type="text"
                  placeholder="Give it a cute caption..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/50 font-quicksand text-pink-700 placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                />

                {/* Category */}
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/50 font-quicksand text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                >
                  <option value="nature">Nature</option>
                  <option value="aesthetic">Aesthetic</option>
                  <option value="dreamy">Dreamy</option>
                </select>

                {/* Upload button */}
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-quicksand font-bold text-sm shadow-lg shadow-pink-300/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Upload Photo'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ImagePlus className="w-16 h-16 text-pink-200 mx-auto mb-4" />
            <p className="font-dancing text-pink-300 text-2xl">
              No photos yet... add some!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden shadow-lg shadow-pink-100/50 card-hover cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-dancing text-white text-lg">
                    {photo.title}
                  </p>
                </div>

                {/* Like button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(photo.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      liked.has(photo.id)
                        ? 'text-pink-500 fill-pink-500'
                        : 'text-pink-300'
                    }`}
                  />
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePhoto(photo.id);
                  }}
                  className="absolute top-3 left-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <Trash2 className="w-4 h-4 text-pink-400" />
                </button>

                {/* Click to open lightbox */}
                <div
                  className="absolute inset-0"
                  onClick={() => setLightbox(photo.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (() => {
        const photo = photos.find((p) => p.id === lightbox);
        if (!photo) return null;
        return (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(-1);
              }}
              className="absolute left-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(1);
              }}
              className="absolute right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
              <div className="relative">
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className="w-full rounded-2xl shadow-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl">
                  <p className="font-dancing text-white text-2xl">
                    {photo.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
