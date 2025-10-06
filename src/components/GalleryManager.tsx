import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Folder,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
}

interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  images: GalleryImage[];
}

const GalleryManager = () => {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Test if component renders
  console.log("GalleryManager component is rendering");

  // Initialize with default gallery data
  useEffect(() => {
    const savedGallery = localStorage.getItem('royal-academy-gallery');
    if (savedGallery) {
      setCategories(JSON.parse(savedGallery));
    } else {
      const defaultCategories: GalleryCategory[] = [
        {
          id: "campus-life",
          name: "Campus Life",
          description: "Daily life and activities at Royal Academy",
          images: [
            {
              id: "campus-1",
              title: "Main Campus Building",
              description: "Our beautiful main academic building with modern facilities",
              imageUrl: "/api/placeholder/400/300",
              category: "campus-life",
              date: "2024-09-01"
            },
            {
              id: "campus-2", 
              title: "Library Study Area",
              description: "Students studying in our state-of-the-art library",
              imageUrl: "/api/placeholder/400/300",
              category: "campus-life",
              date: "2024-09-05"
            }
          ]
        },
        {
          id: "events",
          name: "School Events",
          description: "Special events and celebrations throughout the year",
          images: [
            {
              id: "event-1",
              title: "Annual Sports Day",
              description: "Students participating in various sports competitions",
              imageUrl: "/api/placeholder/400/300",
              category: "events",
              date: "2024-08-15"
            }
          ]
        },
        {
          id: "academics",
          name: "Academic Excellence",
          description: "Classroom activities and academic achievements",
          images: [
            {
              id: "academic-1",
              title: "Science Laboratory",
              description: "Students conducting experiments in our modern lab",
              imageUrl: "/api/placeholder/400/300",
              category: "academics",
              date: "2024-09-10"
            }
          ]
        }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(defaultCategories));
    }
  }, []);

  const saveGallery = () => {
    localStorage.setItem('royal-academy-gallery', JSON.stringify(categories));
    setMessage("Gallery updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAddImage = () => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      title: "",
      description: "",
      imageUrl: "",
      category: categories[0]?.id || "",
      date: new Date().toISOString().split('T')[0]
    };
    setEditingImage(newImage);
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage({ ...image });
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSaveImage = () => {
    if (!editingImage || !editingImage.title.trim() || !editingImage.imageUrl.trim()) {
      alert("Please fill in title and upload an image");
      return;
    }

    const updatedCategories = categories.map(category => {
      if (category.id === editingImage.category) {
        if (isAddingNew) {
          return {
            ...category,
            images: [...category.images, editingImage]
          };
        } else {
          return {
            ...category,
            images: category.images.map(img => 
              img.id === editingImage.id ? editingImage : img
            )
          };
        }
      }
      return category;
    });

    setCategories(updatedCategories);
    localStorage.setItem('royal-academy-gallery', JSON.stringify(updatedCategories));
    setIsEditing(false);
    setEditingImage(null);
    setMessage(isAddingNew ? "Image added successfully!" : "Image updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteImage = (imageId: string, categoryId: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            images: category.images.filter(img => img.id !== imageId)
          };
        }
        return category;
      });
      setCategories(updatedCategories);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updatedCategories));
      setMessage("Image deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setEditingImage({
          ...editingImage,
          imageUrl: imageData
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateImageField = (field: keyof GalleryImage, value: string) => {
    if (!editingImage) return;
    setEditingImage({
      ...editingImage,
      [field]: value
    });
  };

  const addNewCategory = () => {
    const categoryName = prompt("Enter new category name:");
    if (categoryName && categoryName.trim()) {
      const newCategory: GalleryCategory = {
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName.trim(),
        description: `Images related to ${categoryName.trim()}`,
        images: []
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      localStorage.setItem('royal-academy-gallery', JSON.stringify(updatedCategories));
      setMessage("Category added successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Gallery Manager</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage photo galleries and image collections</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={addNewCategory} variant="outline" size="sm" className="w-full sm:w-auto">
            <Folder className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button onClick={handleAddImage} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Filter by Category:</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-bold">
                  {isAddingNew ? "Add New Image" : "Edit Image"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Image Title</label>
                  <Input
                    value={editingImage.title}
                    onChange={(e) => updateImageField('title', e.target.value)}
                    placeholder="Enter image title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={editingImage.description}
                    onChange={(e) => updateImageField('description', e.target.value)}
                    placeholder="Enter image description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={editingImage.category}
                    onValueChange={(value) => updateImageField('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={editingImage.date}
                    onChange={(e) => updateImageField('date', e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Image</label>
                  <div className="space-y-3">
                    {editingImage.imageUrl && (
                      <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
                        <img
                          src={editingImage.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button variant="outline" asChild className="cursor-pointer w-full">
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            {editingImage.imageUrl ? "Change Image" : "Upload Image"}
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveImage} className="bg-gradient-to-r from-royal to-gold text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingNew ? "Add" : "Update"} Image
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Categories */}
      <div className="space-y-8">
        {categories
          .filter(category => !selectedCategory || category.id === selectedCategory)
          .map((category) => (
          <div key={category.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
              <h3 className="text-xl font-heading font-bold text-white">
                {category.name} ({category.images.length} images)
              </h3>
              <p className="text-white/80 text-sm">{category.description}</p>
            </div>
            
            <div className="p-6">
              {category.images.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No images in this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.images.map((image) => (
                    <motion.div
                      key={image.id}
                      layout
                      className="bg-background/50 border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={image.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-foreground mb-1 text-sm">{image.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{image.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(image.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditImage(image)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteImage(image.id, category.id)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Link */}
      {showPreview && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h3 className="font-semibold text-foreground">Live Preview</h3>
              <p className="text-sm text-muted-foreground">View how the gallery looks to visitors</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="/gallery" target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Open Gallery Page
              </a>
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={saveGallery} className="bg-gradient-to-r from-royal to-gold text-white">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default GalleryManager;
