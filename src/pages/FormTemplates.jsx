import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
// import { FormTemplate } from "@/entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileText,
  Users,
  Calendar,
  MessageSquare,
  ShoppingCart,
  Briefcase,
  Star,
  Search,
  BarChart3,
  Sparkles
} from "lucide-react";

const categoryIcons = {
  contact: MessageSquare,
  survey: BarChart3,
  registration: Users,
  feedback: Star,
  order: ShoppingCart,
  application: Briefcase,
  booking: Calendar,
  quiz: FileText,
  other: Sparkles
};

export default function FormTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await base44.entities.FormTemplate.list("-usageCount");
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (template) => {
    try {
      const newForm = await base44.entities.Form.create({
        ...template.formData,
        title: `${template.formData.title} (from template)`
      });
      
      await base44.entities.FormTemplate.update(template.id, {
        usageCount: (template.usageCount || 0) + 1
      });
      
      navigate(createPageUrl(`EditForm?id=${newForm.id}`));
    } catch (error) {
      console.error("Error creating form from template:", error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "contact", "survey", "registration", "feedback", "order", "application", "booking", "quiz", "other"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="neu-card p-6 sm:p-8">
          <div className="animate-pulse text-gray-600">Loading templates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="neu-card p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Form Templates</h1>
        </div>
        <p className="text-gray-600">Start with a pre-built template and customize to your needs</p>
      </div>

      {/* Search and Filter */}
      <div className="neu-card p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input w-full pl-10 pr-4 py-3 text-gray-700 placeholder-gray-500"
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'neu-pressed text-blue-600'
                    : 'neu-button text-gray-700 hover:text-gray-900'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full neu-card p-8 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const IconComponent = categoryIcons[template.category] || Sparkles;
            return (
              <div key={template.id} className="neu-card p-4 sm:p-6 hover:shadow-xl transition-all">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="neu-raised p-3 rounded-lg">
                    <IconComponent className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Used {template.usageCount || 0} times
                  </span>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="neu-button px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 text-sm"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}