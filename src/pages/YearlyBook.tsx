import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  ArrowLeft,
  Filter,
  ExternalLink,
  GraduationCap,
  User,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { loadYearlyBooks, YearlyBook } from "@/lib/booksHelper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const YearlyBookPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<YearlyBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<YearlyBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const loadedBooks = await loadYearlyBooks();
      setBooks(loadedBooks);
      setFilteredBooks(loadedBooks);
      
      const uniqueYears = Array.from(new Set(loadedBooks.map(book => book.year))).sort();
      setAvailableYears(uniqueYears);
      
      setLoading(false);
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books;

    if (selectedClass !== "all") {
      filtered = filtered.filter(book => book.class === parseInt(selectedClass));
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(book => book.year === selectedYear);
    }

    setFilteredBooks(filtered);
  }, [selectedClass, selectedYear, books]);

  const resetFilters = () => {
    setSelectedClass("all");
    setSelectedYear("all");
  };

  const groupedBooks = filteredBooks.reduce((acc, book) => {
    if (!acc[book.class]) {
      acc[book.class] = [];
    }
    acc[book.class].push(book);
    return acc;
  }, {} as Record<number, YearlyBook[]>);

  const sortedClasses = Object.keys(groupedBooks).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-royal/20 via-background to-gold/20"></div>
        <div className="container-wide relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gold animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold mb-4 sm:mb-6">
              <span className="text-gradient-gold">Yearly Book Collection</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Discover our recommended books for each class. Browse by grade level or academic year to find the perfect reading materials for your studies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 border-b border-border bg-muted/20">
        <div className="container-wide px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
          >
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-semibold">Filter Books</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(cls => (
                    <SelectItem key={cls} value={cls.toString()}>
                      Class {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedClass !== "all" || selectedYear !== "all") && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  className="w-full sm:w-auto"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Books Section */}
      <section className="section-padding">
        <div className="container-wide px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading books...</p>
              </div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <BookOpen className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
              <h3 className="text-2xl font-semibold mb-2">No Books Found</h3>
              <p className="text-muted-foreground mb-6">
                {selectedClass !== "all" || selectedYear !== "all" 
                  ? "Try adjusting your filters to see more books."
                  : "No books have been added yet. Check back soon!"}
              </p>
              {(selectedClass !== "all" || selectedYear !== "all") && (
                <Button onClick={resetFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-12">
              {sortedClasses.map((classNum, classIndex) => (
                <motion.div
                  key={classNum}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: classIndex * 0.1 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <GraduationCap className="h-6 w-6 text-gold" />
                      <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                        Class {classNum}
                      </h2>
                      <Badge variant="secondary" className="ml-2">
                        {groupedBooks[classNum].length} {groupedBooks[classNum].length === 1 ? 'book' : 'books'}
                      </Badge>
                    </div>
                    <div className="h-1 w-20 bg-gradient-to-r from-gold to-royal rounded-full"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedBooks[classNum].map((book, bookIndex) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: bookIndex * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-border hover:border-gold/50">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <BookOpen className="h-8 w-8 text-gold flex-shrink-0" />
                              <Badge variant="outline" className="text-xs">
                                {book.year}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl font-semibold line-clamp-2">
                              {book.title}
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-2 mt-2">
                              <User className="h-4 w-4" />
                              <span className="text-sm">{book.author}</span>
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="flex-grow">
                            <div className="flex items-start space-x-2 mb-3">
                              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {book.description}
                              </p>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="pt-4 border-t border-border">
                            <Button 
                              className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-500/90 text-black font-semibold"
                              onClick={() => window.open(book.buying_link, '_blank', 'noopener,noreferrer')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Buy Now
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default YearlyBookPage;
