import React, { useState, useEffect } from "react";

const GalleryManagerSimple = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [formData, setFormData] = useState({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
  
  useEffect(() => {
    const savedGallery = localStorage.getItem('royal-academy-gallery');
    if (savedGallery) {
      setCategories(JSON.parse(savedGallery));
    }
  }, []);

  const addCategory = () => {
    setShowCategoryForm(true);
    setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: `Images for ${formData.name.trim()}`,
        images: []
      };
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Category added successfully! 👑");
      setTimeout(() => setMessage(""), 3000);
      setShowCategoryForm(false);
      setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
    }
  };

  const addPhoto = () => {
    if (categories.length === 0) {
      setMessage("Please create a category first! 📁");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setShowPhotoForm(true);
    setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: categories[0]?.id || "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setFormData({ ...formData, imageUrl: imageData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.selectedCategory) {
      const categoryId = formData.selectedCategory;
      const newPhoto = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim() || "",
        imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        category: categoryId,
        date: new Date().toISOString().split('T')[0]
      };
      
      const updated = categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, images: [...(cat.images || []), newPhoto] };
        }
        return cat;
      });
      
      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Photo added successfully! 📸👑");
      setTimeout(() => setMessage(""), 3000);
      setShowPhotoForm(false);
      setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
    }
  };

  const deleteCategory = (categoryId) => {
    if (confirm("Delete this category and all its photos?")) {
      const updated = categories.filter(cat => cat.id !== categoryId);
      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Category deleted! 🗑️");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const deletePhoto = (categoryId, photoId) => {
    if (confirm("Delete this photo?")) {
      const updated = categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, images: cat.images.filter(img => img.id !== photoId) };
        }
        return cat;
      });
      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Photo deleted! 🗑️");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const editPhoto = (categoryId, photoId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const photo = category?.images?.find(img => img.id === photoId);
    if (photo) {
      setEditingPhoto({ categoryId, photoId, photo });
      setFormData({ name: "", title: photo.title, description: photo.description, imageUrl: photo.imageUrl, selectedCategory: photo.category });
      setShowEditForm(true);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.selectedCategory && editingPhoto) {
      // If category changed, we need to move the photo
      const oldCategoryId = editingPhoto.categoryId;
      const newCategoryId = formData.selectedCategory;
      
      let updated = categories.map(cat => {
        // Remove photo from old category
        if (cat.id === oldCategoryId) {
          return {
            ...cat,
            images: cat.images.filter(img => img.id !== editingPhoto.photoId)
          };
        }
        return cat;
      });

      // Add updated photo to new category
      updated = updated.map(cat => {
        if (cat.id === newCategoryId) {
          const updatedPhoto = {
            ...editingPhoto.photo,
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: newCategoryId,
            imageUrl: formData.imageUrl
          };
          return {
            ...cat,
            images: [...cat.images, updatedPhoto]
          };
        }
        return cat;
      });

      setCategories(updated);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updated));
      setMessage("Photo updated! ✏️👑");
      setTimeout(() => setMessage(""), 3000);
      setShowEditForm(false);
      setEditingPhoto(null);
      setFormData({ name: "", title: "", description: "", imageUrl: "", selectedCategory: "" });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Royal Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-3xl">👑</span>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Royal Gallery Manager
              </h1>
              <p className="text-xl text-gray-300 flex items-center justify-center space-x-2">
                <span>✨</span>
                <span>Manage your royal photo collection with elegance</span>
                <span>⭐</span>
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-8 text-center">
            <div className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-lg animate-bounce">
              <div className="flex items-center space-x-3">
                <span>⭐</span>
                <span className="font-bold text-lg">{message}</span>
                <span>✨</span>
              </div>
            </div>
          </div>
        )}

        {/* Royal Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <button
            onClick={addCategory}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 text-white px-8 py-6 rounded-3xl font-bold text-2xl shadow-2xl transform hover:scale-110 hover:-translate-y-3 transition-all duration-500 border-2 border-white/20 hover:border-white/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative flex flex-col items-center space-y-3">
              <div className="text-5xl animate-bounce drop-shadow-lg">📁</div>
              <span className="drop-shadow-md">Add Royal Category</span>
              <div className="text-sm opacity-90 font-medium">Create new photo categories</div>
            </div>
          </button>

          <button
            onClick={addPhoto}
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white px-8 py-6 rounded-3xl font-bold text-2xl shadow-2xl transform hover:scale-110 hover:-translate-y-3 transition-all duration-500 border-2 border-white/20 hover:border-white/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative flex flex-col items-center space-y-3">
              <div className="text-5xl animate-pulse drop-shadow-lg">📸</div>
              <span className="drop-shadow-md">Add Royal Photo</span>
              <div className="text-sm opacity-90 font-medium">Upload beautiful images</div>
            </div>
          </button>
        </div>

        {/* Royal Forms */}
        {/* Add Category Form */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1 text-center">
                    <div className="text-4xl mb-3">👑</div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Create Royal Category
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-lg font-bold">×</span>
                  </button>
                </div>
                
                <form onSubmit={handleCategorySubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter category name..."
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-white focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 font-medium text-gray-900 placeholder-gray-500"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-semibold shadow-lg"
                    >
                      Create Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Photo Form */}
        {showPhotoForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-white via-emerald-50 to-teal-50 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1 text-center">
                    <div className="text-4xl mb-3">📸</div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Add Royal Photo
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPhotoForm(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-lg font-bold">×</span>
                  </button>
                </div>
                
                <form onSubmit={handlePhotoSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Photo Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter photo title..."
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl bg-white focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 font-medium text-gray-900 placeholder-gray-500"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter photo description..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl bg-white focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 font-medium resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">📁 Select Category</label>
                    <select
                      value={formData.selectedCategory}
                      onChange={(e) => setFormData({...formData, selectedCategory: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl bg-white focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 font-medium text-gray-900"
                      required
                    >
                      <option value="">Choose category...</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          🏰 {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Upload Photo</label>
                    {formData.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl border-2 border-emerald-200"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-all duration-300 text-emerald-700 font-medium"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">📸</div>
                          <div>{formData.imageUrl ? "Change Photo" : "Choose Photo"}</div>
                          <div className="text-xs opacity-70">Click to upload your image</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowPhotoForm(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 font-semibold shadow-lg"
                    >
                      Add Photo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Photo Form */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-3xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1 text-center">
                    <div className="text-4xl mb-3">✏️</div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      Edit Royal Photo
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-lg font-bold">×</span>
                  </button>
                </div>
                
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Photo Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter photo title..."
                      className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl bg-white focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-all duration-300 font-medium text-gray-900 placeholder-gray-500"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter photo description..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl bg-white focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-all duration-300 font-medium resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">📁 Change Category</label>
                    <select
                      value={formData.selectedCategory}
                      onChange={(e) => setFormData({...formData, selectedCategory: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl bg-white focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-all duration-300 font-medium text-gray-900"
                      required
                    >
                      <option value="">Choose category...</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          🏰 {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 font-semibold shadow-lg"
                    >
                      Update Photo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Status */}
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              🏰 Royal Gallery Status
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-400/30">
              <div className="text-4xl mb-3">📚</div>
              <div className="text-2xl font-bold text-blue-300">{categories.length}</div>
              <div className="text-blue-200">Categories</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
              <div className="text-4xl mb-3">🖼️</div>
              <div className="text-2xl font-bold text-green-300">
                {categories.reduce((total, cat) => total + (cat.images?.length || 0), 0)}
              </div>
              <div className="text-green-200">Total Photos</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
              <div className="text-4xl mb-3">👑</div>
              <div className="text-2xl font-bold text-yellow-300">Royal</div>
              <div className="text-yellow-200">Quality</div>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4 text-center">📋 Your Royal Categories:</h3>
              <div className="space-y-8">
                {categories.map((category, index) => (
                  <div key={category.id || index} className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-lg rounded-2xl border border-purple-400/30 overflow-hidden">
                    {/* Category Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🏰</span>
                          <div>
                            <div className="font-bold text-white text-lg">{category.name}</div>
                            <div className="text-sm text-purple-100">{category.images?.length || 0} photos</div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                          🗑️ Delete Category
                        </button>
                      </div>
                    </div>
                    
                    {/* Photos Grid */}
                    <div className="p-6">
                      {(!category.images || category.images.length === 0) ? (
                        <div className="text-center py-8 text-gray-400">
                          <div className="text-6xl mb-4">📷</div>
                          <p className="text-lg">No photos in this category yet.</p>
                          <button
                            onClick={addPhoto}
                            className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                          >
                            📸 Add First Photo
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {category.images.map((photo) => (
                            <div
                              key={photo.id}
                              className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl overflow-hidden border border-gray-600/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                            >
                              {/* Photo Image */}
                              <div className="aspect-video overflow-hidden">
                                <img
                                  src={photo.imageUrl}
                                  alt={photo.title}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              
                              {/* Photo Info */}
                              <div className="p-4">
                                <h4 className="font-bold text-white mb-1 text-sm">{photo.title}</h4>
                                <p className="text-xs text-gray-300 mb-3 line-clamp-2">{photo.description}</p>
                                
                                {/* Photo Actions */}
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-gray-400 flex items-center space-x-1">
                                    <span>📅</span>
                                    <span>{new Date(photo.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => editPhoto(category.id, photo.id)}
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold transition-all duration-300 transform hover:scale-110"
                                    >
                                      ✏️ Edit
                                    </button>
                                    <button
                                      onClick={() => deletePhoto(category.id, photo.id)}
                                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold transition-all duration-300 transform hover:scale-110"
                                    >
                                      🗑️ Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-lg rounded-2xl px-8 py-4 border border-gray-600/30">
            <span className="animate-pulse">✨</span>
            <span className="text-gray-300 font-medium">Royal Academy Gallery Management System</span>
            <span className="animate-bounce">👑</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryManagerSimple;
