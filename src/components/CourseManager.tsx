import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  EyeOff,
  BookOpen,
  GraduationCap,
  Clock,
  Users,
  Award,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSupabaseData, setSupabaseData, subscribeToSupabaseChanges } from "@/lib/supabaseHelpers";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  credits: string;
  prerequisites: string;
  syllabus: string[];
  instructor: string;
  schedule: string;
  capacity: string;
  fee: string;
  startDate: string;
  endDate: string;
}

interface CourseCategory {
  id: string;
  name: string;
  description: string;
  courses: Course[];
}

const CourseManager = () => {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize with default course data
  useEffect(() => {
    const loadCourses = async () => {
      const savedCourses = await getSupabaseData<CourseCategory[]>('royal-academy-courses', null);
      if (savedCourses) {
        setCategories(savedCourses);
      } else {
        const defaultCategories: CourseCategory[] = [
        {
          id: "undergraduate",
          name: "Undergraduate Programs",
          description: "Bachelor's degree programs across various disciplines",
          courses: [
            {
              id: "cs-101",
              title: "Computer Science",
              description: "Comprehensive program covering software development, algorithms, and computer systems",
              category: "undergraduate",
              level: "Bachelor's",
              duration: "4 years",
              credits: "120",
              prerequisites: "High School Diploma, Mathematics",
              syllabus: [
                "Programming Fundamentals",
                "Data Structures and Algorithms", 
                "Database Systems",
                "Software Engineering",
                "Computer Networks",
                "Artificial Intelligence"
              ],
              instructor: "Dr. Sarah Johnson",
              schedule: "Monday-Friday, 9:00 AM - 5:00 PM",
              capacity: "150",
              fee: "$45,000/year",
              startDate: "2024-09-01",
              endDate: "2028-05-31"
            },
            {
              id: "eng-101",
              title: "English Literature",
              description: "In-depth study of literature, writing, and critical analysis",
              category: "undergraduate",
              level: "Bachelor's",
              duration: "4 years", 
              credits: "120",
              prerequisites: "High School Diploma, English Proficiency",
              syllabus: [
                "Literary Analysis",
                "Creative Writing",
                "World Literature",
                "Modern Poetry",
                "Shakespeare Studies",
                "Contemporary Fiction"
              ],
              instructor: "Prof. Michael Chen",
              schedule: "Monday, Wednesday, Friday, 10:00 AM - 12:00 PM",
              capacity: "80",
              fee: "$42,000/year",
              startDate: "2024-09-01",
              endDate: "2028-05-31"
            }
          ]
        },
        {
          id: "graduate",
          name: "Graduate Programs",
          description: "Master's and doctoral programs for advanced study",
          courses: [
            {
              id: "mba-101",
              title: "Master of Business Administration",
              description: "Advanced business education with focus on leadership and strategy",
              category: "graduate",
              level: "Master's",
              duration: "2 years",
              credits: "60",
              prerequisites: "Bachelor's Degree, Work Experience",
              syllabus: [
                "Strategic Management",
                "Financial Analysis",
                "Marketing Strategy",
                "Operations Management",
                "Leadership Development",
                "Business Ethics"
              ],
              instructor: "Dr. Emily Rodriguez",
              schedule: "Tuesday, Thursday, 6:00 PM - 9:00 PM",
              capacity: "50",
              fee: "$65,000/year",
              startDate: "2024-09-01",
              endDate: "2026-05-31"
            }
          ]
        }
      ];
        setCategories(defaultCategories);
        await setSupabaseData('royal-academy-courses', defaultCategories);
      }
    };
    
    loadCourses();
    
    // Subscribe to realtime changes
    const unsubscribe = subscribeToSupabaseChanges<CourseCategory[]>(
      'royal-academy-courses',
      (newData) => {
        console.log('[CourseManager] Received realtime update');
        setCategories(newData);
      }
    );
    
    return () => unsubscribe();
  }, []);

  const saveCourses = async () => {
    await setSupabaseData('royal-academy-courses', categories);
    setMessage("Courses updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title: "",
      description: "",
      category: categories[0]?.id || "",
      level: "Bachelor's",
      duration: "",
      credits: "",
      prerequisites: "",
      syllabus: [],
      instructor: "",
      schedule: "",
      capacity: "",
      fee: "",
      startDate: "",
      endDate: ""
    };
    setEditingCourse(newCourse);
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course });
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleSaveCourse = async () => {
    if (!editingCourse || !editingCourse.title.trim() || !editingCourse.description.trim()) {
      alert("Please fill in title and description");
      return;
    }

    const updatedCategories = categories.map(category => {
      if (category.id === editingCourse.category) {
        if (isAddingNew) {
          return {
            ...category,
            courses: [...category.courses, editingCourse]
          };
        } else {
          return {
            ...category,
            courses: category.courses.map(course => 
              course.id === editingCourse.id ? editingCourse : course
            )
          };
        }
      }
      return category;
    });

    setCategories(updatedCategories);
    await setSupabaseData('royal-academy-courses', updatedCategories);
    setIsEditing(false);
    setEditingCourse(null);
    setMessage(isAddingNew ? "Course added successfully!" : "Course updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteCourse = async (courseId: string, categoryId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            courses: category.courses.filter(course => course.id !== courseId)
          };
        }
        return category;
      });
      setCategories(updatedCategories);
      await setSupabaseData('royal-academy-courses', updatedCategories);
      setMessage("Course deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const updateCourseField = (field: keyof Course, value: any) => {
    if (!editingCourse) return;
    setEditingCourse({
      ...editingCourse,
      [field]: value
    });
  };

  const addSyllabusItem = () => {
    const newItem = prompt("Enter syllabus item:");
    if (newItem && newItem.trim() && editingCourse) {
      setEditingCourse({
        ...editingCourse,
        syllabus: [...editingCourse.syllabus, newItem.trim()]
      });
    }
  };

  const removeSyllabusItem = (index: number) => {
    if (!editingCourse) return;
    setEditingCourse({
      ...editingCourse,
      syllabus: editingCourse.syllabus.filter((_, i) => i !== index)
    });
  };

  const addNewCategory = async () => {
    const categoryName = prompt("Enter new category name:");
    if (categoryName && categoryName.trim()) {
      const newCategory: CourseCategory = {
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName.trim(),
        description: `Programs in ${categoryName.trim()}`,
        courses: []
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      await setSupabaseData('royal-academy-courses', updatedCategories);
      setMessage("Category added successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">Course Manager</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage academic programs and course offerings</p>
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
            <BookOpen className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button onClick={handleAddCourse} className="w-full sm:w-auto bg-gradient-to-r from-royal to-gold text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && editingCourse && (
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
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-bold">
                  {isAddingNew ? "Add New Course" : "Edit Course"}
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Course Title</label>
                    <Input
                      value={editingCourse.title}
                      onChange={(e) => updateCourseField('title', e.target.value)}
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={editingCourse.description}
                      onChange={(e) => updateCourseField('description', e.target.value)}
                      placeholder="Enter course description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select
                        value={editingCourse.category}
                        onValueChange={(value) => updateCourseField('category', value)}
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
                      <label className="text-sm font-medium mb-2 block">Level</label>
                      <Select
                        value={editingCourse.level}
                        onValueChange={(value) => updateCourseField('level', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Certificate">Certificate</SelectItem>
                          <SelectItem value="Diploma">Diploma</SelectItem>
                          <SelectItem value="Bachelor's">Bachelor's</SelectItem>
                          <SelectItem value="Master's">Master's</SelectItem>
                          <SelectItem value="Doctoral">Doctoral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration</label>
                      <Input
                        value={editingCourse.duration}
                        onChange={(e) => updateCourseField('duration', e.target.value)}
                        placeholder="4 years"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Credits</label>
                      <Input
                        value={editingCourse.credits}
                        onChange={(e) => updateCourseField('credits', e.target.value)}
                        placeholder="120"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Prerequisites</label>
                    <Textarea
                      value={editingCourse.prerequisites}
                      onChange={(e) => updateCourseField('prerequisites', e.target.value)}
                      placeholder="Enter prerequisites"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Instructor</label>
                    <Input
                      value={editingCourse.instructor}
                      onChange={(e) => updateCourseField('instructor', e.target.value)}
                      placeholder="Dr. John Smith"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Schedule</label>
                    <Input
                      value={editingCourse.schedule}
                      onChange={(e) => updateCourseField('schedule', e.target.value)}
                      placeholder="Monday-Friday, 9:00 AM - 5:00 PM"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Capacity</label>
                      <Input
                        value={editingCourse.capacity}
                        onChange={(e) => updateCourseField('capacity', e.target.value)}
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Fee</label>
                      <Input
                        value={editingCourse.fee}
                        onChange={(e) => updateCourseField('fee', e.target.value)}
                        placeholder="$45,000/year"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Start Date</label>
                      <Input
                        type="date"
                        value={editingCourse.startDate}
                        onChange={(e) => updateCourseField('startDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">End Date</label>
                      <Input
                        type="date"
                        value={editingCourse.endDate}
                        onChange={(e) => updateCourseField('endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Syllabus</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addSyllabusItem}
                        type="button"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {editingCourse.syllabus.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={item}
                            onChange={(e) => {
                              const newSyllabus = [...editingCourse.syllabus];
                              newSyllabus[index] = e.target.value;
                              updateCourseField('syllabus', newSyllabus);
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSyllabusItem(index)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {editingCourse.syllabus.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No syllabus items added yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCourse} className="bg-gradient-to-r from-royal to-gold text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingNew ? "Add" : "Update"} Course
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Categories */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4">
              <h3 className="text-xl font-heading font-bold text-white">
                {category.name} ({category.courses.length} courses)
              </h3>
              <p className="text-white/80 text-sm">{category.description}</p>
            </div>
            
            <div className="p-6">
              {category.courses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No courses in this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {category.courses.map((course) => (
                    <motion.div
                      key={course.id}
                      layout
                      className="bg-background/50 border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-lg mb-1">{course.title}</h4>
                          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{course.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-3 w-3" />
                          <span>{course.level}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{course.capacity} students</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>{course.credits} credits</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-green-600">{course.fee}</div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCourse(course)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id, category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">Delete</span>
                          </Button>
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
              <p className="text-sm text-muted-foreground">View how courses appear to students</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="/academics" target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Open Academics Page
              </a>
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={saveCourses} className="bg-gradient-to-r from-royal to-gold text-white">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default CourseManager;
