import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Save, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  HelpCircle, 
  Phone, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Award,
  FileText
} from "lucide-react";
import { Button } from './ui/button-variants';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface AdmissionsData {
  hero: {
    title: string;
    subtitle: string;
    stats: {
      applicationFee: string;
      decisionTime: string;
      studentsReceiveAid: string;
      countriesRepresented: string;
    };
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{
      id: string;
      title: string;
      timeline: string;
      description: string;
      features: string[];
    }>;
  };
  requirements: {
    title: string;
    subtitle: string;
    categories: Array<{
      id: string;
      title: string;
      items: string[];
    }>;
    specialSections: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  dates: {
    title: string;
    subtitle: string;
    deadlines: Array<{
      id: string;
      month: string;
      day: string;
      title: string;
      description: string;
      features: string[];
    }>;
  };
  affordability: {
    title: string;
    subtitle: string;
    tabs: string[];
    content: {
      tuition: string;
      scholarships: string;
      payments: string;
    };
  };
  campus: {
    title: string;
    subtitle: string;
    description: string;
    images: string[];
  };
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  contact: {
    title: string;
    email: string;
    phone: string;
    hours: string;
    address: {
      name: string;
      street: string;
      city: string;
    };
  };
}

const AdmissionsPageManager: React.FC = () => {
  const [admissionsData, setAdmissionsData] = useState<AdmissionsData>({
    hero: {
      title: "Admissions that put your future first",
      subtitle: "Join a vibrant, supportive community. Our application is fast, holistic, and designed to highlight what makes you, you.",
      stats: {
        applicationFee: "$0",
        decisionTime: "14 days",
        studentsReceiveAid: "92%",
        countriesRepresented: "70+"
      }
    },
    process: {
      title: "How it works",
      subtitle: "Your path to admission",
      steps: [
        {
          id: "1",
          title: "Submit Application",
          timeline: "By March 1st",
          description: "Complete our comprehensive application form with all required documents.",
          features: ["Secure", "Save-as-you-go"]
        },
        {
          id: "2",
          title: "Campus Interview",
          timeline: "March - April",
          description: "Meet with our admissions team for a personal interview and campus tour.",
          features: ["Secure", "Save-as-you-go"]
        },
        {
          id: "3",
          title: "Assessment Review",
          timeline: "April - May",
          description: "Our committee reviews academic records, recommendations, and achievements.",
          features: ["Secure", "Save-as-you-go"]
        },
        {
          id: "4",
          title: "Admission Decision",
          timeline: "By May 15th",
          description: "Receive your admission decision and enrollment information.",
          features: ["Secure", "Save-as-you-go"]
        }
      ]
    },
    requirements: {
      title: "Requirements",
      subtitle: "What you'll need to apply",
      categories: [
        {
          id: "academic",
          title: "Academic Records",
          items: ["Transcripts", "Grade Reports", "Test Scores", "Academic Portfolio"]
        },
        {
          id: "personal",
          title: "Personal Documents",
          items: ["Application Form", "Personal Statement", "Letters of Recommendation", "Interview"]
        },
        {
          id: "additional",
          title: "Additional",
          items: ["Extracurricular Activities", "Awards & Achievements", "Community Service", "Special Talents"]
        }
      ],
      specialSections: [
        {
          id: "international",
          title: "International Students",
          description: "English proficiency (IELTS/TOEFL/Duolingo), credential evaluation, financial documentation."
        },
        {
          id: "transfer",
          title: "Transfer Applicants",
          description: "College transcripts and course syllabi for credit evaluation."
        },
        {
          id: "accommodations",
          title: "Accommodations",
          description: "We provide reasonable accommodations—contact us to discuss your needs."
        }
      ]
    },
    dates: {
      title: "Important dates",
      subtitle: "Application deadlines",
      deadlines: [
        {
          id: "early",
          month: "Nov",
          day: "15",
          title: "Early Action",
          description: "Fall Intake – Early Action",
          features: ["Merit aid", "Priority housing"]
        },
        {
          id: "regular",
          month: "Jan",
          day: "15",
          title: "Regular",
          description: "Fall Intake – Regular",
          features: ["Need-based aid", "Rolling review"]
        },
        {
          id: "spring",
          month: "Apr",
          day: "01",
          title: "Spring",
          description: "Spring Intake",
          features: ["Rolling"]
        },
        {
          id: "transfer",
          month: "Rolling",
          day: "+",
          title: "Transfer",
          description: "Transfer Applicants",
          features: []
        }
      ]
    },
    affordability: {
      title: "Affordability",
      subtitle: "Tuition and financial aid",
      tabs: ["Tuition & Fees (2025)", "Scholarships & Grants", "Payment Plans"],
      content: {
        tuition: "Estimated tuition: $28,500 per year. Fees vary by program and credits. Contact us for a personalized breakdown.",
        scholarships: "Automatic merit scholarships are awarded at the time of admission. Need-based grants available via aid application.",
        payments: "Monthly, interest-free plans available. Third-party sponsorships supported."
      }
    },
    campus: {
      title: "See the campus",
      subtitle: "Tour, info sessions, and counselor chats",
      description: "Can't visit? Join a virtual info session or book a 1:1 with our admissions team.",
      images: []
    },
    faqs: [
      {
        id: "1",
        question: "Is there an application fee?",
        answer: "No, there is no application fee for Royal Academy."
      },
      {
        id: "2",
        question: "Are test scores required?",
        answer: "Test scores are optional but recommended for scholarship consideration."
      },
      {
        id: "3",
        question: "Can I apply before all documents arrive?",
        answer: "Yes, you can submit your application and send documents as they become available."
      },
      {
        id: "4",
        question: "What if I need accommodations?",
        answer: "We provide reasonable accommodations. Contact our admissions office to discuss your needs."
      },
      {
        id: "5",
        question: "When will I receive my admission decision?",
        answer: "Expect a decision within 2-3 weeks of completing your application."
      },
      {
        id: "6",
        question: "Do you offer financial aid?",
        answer: "Yes, we offer need-based and merit-based financial aid to qualified students."
      }
    ],
    contact: {
      title: "Contact Admissions",
      email: "admissions@royalacademy.edu",
      phone: "+1 (555) 123-4567",
      hours: "Mon–Fri, 9am–5pm",
      address: {
        name: "Royal Academy",
        street: "123 Excellence Boulevard",
        city: "Academic City, AC 12345"
      }
    }
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('royal-academy-admissions');
    if (savedData) {
      setAdmissionsData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem('royal-academy-admissions', JSON.stringify(admissionsData));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('admissions-data-updated'));
    
    alert('Admissions page data saved successfully!');
  };

  // Add new FAQ
  const addFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      const newId = Date.now().toString();
      setAdmissionsData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { id: newId, ...newFAQ }]
      }));
      setNewFAQ({ question: '', answer: '' });
    }
  };

  // Delete FAQ
  const deleteFAQ = (id: string) => {
    setAdmissionsData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(faq => faq.id !== id)
    }));
  };

  // Update FAQ
  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setAdmissionsData(prev => ({
      ...prev,
      faqs: prev.faqs.map(faq => 
        faq.id === id ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const sections = [
    { id: 'hero', title: 'Hero Section', icon: Award },
    { id: 'process', title: 'Application Process', icon: FileText },
    { id: 'requirements', title: 'Requirements', icon: BookOpen },
    { id: 'dates', title: 'Important Dates', icon: Calendar },
    { id: 'affordability', title: 'Affordability', icon: DollarSign },
    { id: 'campus', title: 'Campus Tours', icon: GraduationCap },
    { id: 'faqs', title: 'FAQs', icon: HelpCircle },
    { id: 'contact', title: 'Contact Info', icon: Phone }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Admissions Page Manager</h2>
          <p className="text-sm text-muted-foreground">Edit all content on the admissions page</p>
        </div>
        <Button onClick={saveData} className="bg-gradient-to-r from-gold to-yellow-500 text-black">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            onClick={() => setActiveSection(section.id)}
            size="sm"
            className="flex items-center space-x-2"
          >
            <section.icon className="h-4 w-4" />
            <span>{section.title}</span>
          </Button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-card rounded-lg p-6 border border-border/50">
        {/* Hero Section */}
        {activeSection === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Hero Section</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Main Title</label>
                <Input
                  value={admissionsData.hero.title}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value }
                  }))}
                  placeholder="Main hero title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <Textarea
                  value={admissionsData.hero.subtitle}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value }
                  }))}
                  placeholder="Hero subtitle"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Application Fee</label>
                <Input
                  value={admissionsData.hero.stats.applicationFee}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    hero: { 
                      ...prev.hero, 
                      stats: { ...prev.hero.stats, applicationFee: e.target.value }
                    }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Decision Time</label>
                <Input
                  value={admissionsData.hero.stats.decisionTime}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    hero: { 
                      ...prev.hero, 
                      stats: { ...prev.hero.stats, decisionTime: e.target.value }
                    }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Students Receive Aid</label>
                <Input
                  value={admissionsData.hero.stats.studentsReceiveAid}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    hero: { 
                      ...prev.hero, 
                      stats: { ...prev.hero.stats, studentsReceiveAid: e.target.value }
                    }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Countries Represented</label>
                <Input
                  value={admissionsData.hero.stats.countriesRepresented}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    hero: { 
                      ...prev.hero, 
                      stats: { ...prev.hero.stats, countriesRepresented: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQs Section */}
        {activeSection === 'faqs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            
            {/* Add New FAQ */}
            <div className="bg-muted/20 rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Add New FAQ</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Question</label>
                  <Input
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter the question"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Answer</label>
                  <Textarea
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Enter the answer"
                    rows={3}
                  />
                </div>
                <Button onClick={addFAQ} className="w-fit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            </div>

            {/* Existing FAQs */}
            <div className="space-y-4">
              {admissionsData.faqs.map((faq) => (
                <div key={faq.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium">FAQ #{faq.id}</h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteFAQ(faq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Question</label>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Answer</label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Section Title</label>
                  <Input
                    value={admissionsData.contact.title}
                    onChange={(e) => setAdmissionsData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, title: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    value={admissionsData.contact.email}
                    onChange={(e) => setAdmissionsData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={admissionsData.contact.phone}
                    onChange={(e) => setAdmissionsData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Hours</label>
                  <Input
                    value={admissionsData.contact.hours}
                    onChange={(e) => setAdmissionsData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, hours: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Mailing Address</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Institution Name</label>
                  <Input
                    value={admissionsData.contact.address.name}
                    onChange={(e) => setAdmissionsData(prev => ({
                      ...prev,
                      contact: { 
                        ...prev.contact, 
                        address: { ...prev.contact.address, name: e.target.value }
                      }
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <Input
                    value={admissionsData.contact.address.street}
                    onChange={(e) => setAdmissionsData(prev => ({
                      ...prev,
                      contact: { 
                        ...prev.contact, 
                        address: { ...prev.contact.address, street: e.target.value }
                      }
                    }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">City, State, ZIP</label>
                  <Input
                    value={admissionsData.contact.address.city}
                    onChange={(e) => setAdmissionsData(prev => ({
                      ...prev,
                      contact: { 
                        ...prev.contact, 
                        address: { ...prev.contact.address, city: e.target.value }
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Application Process Section */}
        {activeSection === 'process' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Application Process</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData.process.title}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    process: { ...prev.process, title: e.target.value }
                  }))}
                  placeholder="How it works"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData.process.subtitle}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    process: { ...prev.process, subtitle: e.target.value }
                  }))}
                  placeholder="Your path to admission"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Process Steps</h4>
              {admissionsData.process.steps.map((step, index) => (
                <div key={step.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">Step {step.id}</h5>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          process: {
                            ...prev.process,
                            steps: prev.process.steps.filter(s => s.id !== step.id)
                          }
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Step Title</label>
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            process: {
                              ...prev.process,
                              steps: prev.process.steps.map(s => 
                                s.id === step.id ? { ...s, title: e.target.value } : s
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Timeline</label>
                      <Input
                        value={step.timeline}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            process: {
                              ...prev.process,
                              steps: prev.process.steps.map(s => 
                                s.id === step.id ? { ...s, timeline: e.target.value } : s
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={step.description}
                      onChange={(e) => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          process: {
                            ...prev.process,
                            steps: prev.process.steps.map(s => 
                              s.id === step.id ? { ...s, description: e.target.value } : s
                            )
                          }
                        }));
                      }}
                      rows={3}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
                    <Input
                      value={step.features.join(', ')}
                      onChange={(e) => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          process: {
                            ...prev.process,
                            steps: prev.process.steps.map(s => 
                              s.id === step.id ? { ...s, features: e.target.value.split(', ').filter(f => f.trim()) } : s
                            )
                          }
                        }));
                      }}
                      placeholder="Secure, Save-as-you-go"
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const newStep = {
                    id: (admissionsData.process.steps.length + 1).toString(),
                    title: "New Step",
                    timeline: "Timeline",
                    description: "Step description",
                    features: ["Feature"]
                  };
                  setAdmissionsData(prev => ({
                    ...prev,
                    process: {
                      ...prev.process,
                      steps: [...prev.process.steps, newStep]
                    }
                  }));
                }}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>
          </motion.div>
        )}

        {/* Requirements Section */}
        {activeSection === 'requirements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Requirements</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData.requirements.title}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    requirements: { ...prev.requirements, title: e.target.value }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData.requirements.subtitle}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    requirements: { ...prev.requirements, subtitle: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Requirement Categories</h4>
                {admissionsData.requirements.categories.map((category) => (
                  <div key={category.id} className="border border-border rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium">{category.title}</h5>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            requirements: {
                              ...prev.requirements,
                              categories: prev.requirements.categories.filter(c => c.id !== category.id)
                            }
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category Title</label>
                        <Input
                          value={category.title}
                          onChange={(e) => {
                            setAdmissionsData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                categories: prev.requirements.categories.map(c => 
                                  c.id === category.id ? { ...c, title: e.target.value } : c
                                )
                              }
                            }));
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Items (one per line)</label>
                        <Textarea
                          value={category.items.join('\n')}
                          onChange={(e) => {
                            setAdmissionsData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                categories: prev.requirements.categories.map(c => 
                                  c.id === category.id ? { ...c, items: e.target.value.split('\n').filter(item => item.trim()) } : c
                                )
                              }
                            }));
                          }}
                          rows={4}
                          placeholder="Transcripts&#10;Grade Reports&#10;Test Scores"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={() => {
                    const newCategory = {
                      id: Date.now().toString(),
                      title: "New Category",
                      items: ["Item 1", "Item 2"]
                    };
                    setAdmissionsData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        categories: [...prev.requirements.categories, newCategory]
                      }
                    }));
                  }}
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-4">Special Sections</h4>
                {admissionsData.requirements.specialSections.map((section) => (
                  <div key={section.id} className="border border-border rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium">{section.title}</h5>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            requirements: {
                              ...prev.requirements,
                              specialSections: prev.requirements.specialSections.filter(s => s.id !== section.id)
                            }
                          }));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Section Title</label>
                        <Input
                          value={section.title}
                          onChange={(e) => {
                            setAdmissionsData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                specialSections: prev.requirements.specialSections.map(s => 
                                  s.id === section.id ? { ...s, title: e.target.value } : s
                                )
                              }
                            }));
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          value={section.description}
                          onChange={(e) => {
                            setAdmissionsData(prev => ({
                              ...prev,
                              requirements: {
                                ...prev.requirements,
                                specialSections: prev.requirements.specialSections.map(s => 
                                  s.id === section.id ? { ...s, description: e.target.value } : s
                                )
                              }
                            }));
                          }}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={() => {
                    const newSection = {
                      id: Date.now().toString(),
                      title: "New Special Section",
                      description: "Description for this special section"
                    };
                    setAdmissionsData(prev => ({
                      ...prev,
                      requirements: {
                        ...prev.requirements,
                        specialSections: [...prev.requirements.specialSections, newSection]
                      }
                    }));
                  }}
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Special Section
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Important Dates Section */}
        {activeSection === 'dates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Important Dates</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData.dates.title}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    dates: { ...prev.dates, title: e.target.value }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData.dates.subtitle}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    dates: { ...prev.dates, subtitle: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Application Deadlines</h4>
              {admissionsData.dates.deadlines.map((deadline) => (
                <div key={deadline.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">{deadline.title}</h5>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          dates: {
                            ...prev.dates,
                            deadlines: prev.dates.deadlines.filter(d => d.id !== deadline.id)
                          }
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Month</label>
                      <Input
                        value={deadline.month}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            dates: {
                              ...prev.dates,
                              deadlines: prev.dates.deadlines.map(d => 
                                d.id === deadline.id ? { ...d, month: e.target.value } : d
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Day</label>
                      <Input
                        value={deadline.day}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            dates: {
                              ...prev.dates,
                              deadlines: prev.dates.deadlines.map(d => 
                                d.id === deadline.id ? { ...d, day: e.target.value } : d
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input
                        value={deadline.title}
                        onChange={(e) => {
                          setAdmissionsData(prev => ({
                            ...prev,
                            dates: {
                              ...prev.dates,
                              deadlines: prev.dates.deadlines.map(d => 
                                d.id === deadline.id ? { ...d, title: e.target.value } : d
                              )
                            }
                          }));
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={deadline.description}
                      onChange={(e) => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          dates: {
                            ...prev.dates,
                            deadlines: prev.dates.deadlines.map(d => 
                              d.id === deadline.id ? { ...d, description: e.target.value } : d
                            )
                          }
                        }));
                      }}
                      rows={2}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
                    <Input
                      value={deadline.features.join(', ')}
                      onChange={(e) => {
                        setAdmissionsData(prev => ({
                          ...prev,
                          dates: {
                            ...prev.dates,
                            deadlines: prev.dates.deadlines.map(d => 
                              d.id === deadline.id ? { ...d, features: e.target.value.split(', ').filter(f => f.trim()) } : d
                            )
                          }
                        }));
                      }}
                      placeholder="Merit aid, Priority housing"
                    />
                  </div>
                </div>
              ))}
              
              <Button
                onClick={() => {
                  const newDeadline = {
                    id: Date.now().toString(),
                    month: "Jan",
                    day: "15",
                    title: "New Deadline",
                    description: "Deadline description",
                    features: ["Feature"]
                  };
                  setAdmissionsData(prev => ({
                    ...prev,
                    dates: {
                      ...prev.dates,
                      deadlines: [...prev.dates.deadlines, newDeadline]
                    }
                  }));
                }}
                className="w-fit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deadline
              </Button>
            </div>
          </motion.div>
        )}

        {/* Affordability Section */}
        {activeSection === 'affordability' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Affordability</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData.affordability.title}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    affordability: { ...prev.affordability, title: e.target.value }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData.affordability.subtitle}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    affordability: { ...prev.affordability, subtitle: e.target.value }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tab Names (comma separated)</label>
                <Input
                  value={admissionsData.affordability.tabs.join(', ')}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    affordability: { 
                      ...prev.affordability, 
                      tabs: e.target.value.split(', ').filter(tab => tab.trim()) 
                    }
                  }))}
                  placeholder="Tuition & Fees (2025), Scholarships & Grants, Payment Plans"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Tab Content</h4>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tuition & Fees Content</label>
                <Textarea
                  value={admissionsData.affordability.content.tuition}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    affordability: { 
                      ...prev.affordability, 
                      content: { ...prev.affordability.content, tuition: e.target.value }
                    }
                  }))}
                  rows={3}
                  placeholder="Estimated tuition: $28,500 per year..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Scholarships & Grants Content</label>
                <Textarea
                  value={admissionsData.affordability.content.scholarships}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    affordability: { 
                      ...prev.affordability, 
                      content: { ...prev.affordability.content, scholarships: e.target.value }
                    }
                  }))}
                  rows={3}
                  placeholder="Automatic merit scholarships are awarded..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Payment Plans Content</label>
                <Textarea
                  value={admissionsData.affordability.content.payments}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    affordability: { 
                      ...prev.affordability, 
                      content: { ...prev.affordability.content, payments: e.target.value }
                    }
                  }))}
                  rows={3}
                  placeholder="Monthly, interest-free plans available..."
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Campus Tours Section */}
        {activeSection === 'campus' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Campus Tours</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={admissionsData.campus.title}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    campus: { ...prev.campus, title: e.target.value }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={admissionsData.campus.subtitle}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    campus: { ...prev.campus, subtitle: e.target.value }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={admissionsData.campus.description}
                  onChange={(e) => setAdmissionsData(prev => ({
                    ...prev,
                    campus: { ...prev.campus, description: e.target.value }
                  }))}
                  rows={3}
                  placeholder="Can't visit? Join a virtual info session or book a 1:1 with our admissions team."
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Campus Images (Up to 10)</h4>
              
              {/* Image Upload */}
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => {
                      if (admissionsData.campus.images.length < 10) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const imageUrl = event.target?.result as string;
                          setAdmissionsData(prev => ({
                            ...prev,
                            campus: {
                              ...prev.campus,
                              images: [...prev.campus.images, imageUrl]
                            }
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    });
                  }}
                  className="hidden"
                  id="campus-images"
                />
                <label
                  htmlFor="campus-images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Click to upload campus images<br />
                    <span className="text-xs">({admissionsData.campus.images.length}/10 images)</span>
                  </p>
                </label>
              </div>
              
              {/* Image Gallery */}
              {admissionsData.campus.images.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {admissionsData.campus.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Campus ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setAdmissionsData(prev => ({
                              ...prev,
                              campus: {
                                ...prev.campus,
                                images: prev.campus.images.filter((_, i) => i !== index)
                              }
                            }));
                          }}
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdmissionsPageManager;
