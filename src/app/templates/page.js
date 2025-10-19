"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Import necessary icons from Lucide React
import {
  Search,
  SlidersHorizontal,
  Home,
  FileText,
  Users,
  Settings,
  Plus,
  LayoutTemplate, // Icon for templates
  CheckCircle, // Icon for selected/default template
} from 'lucide-react';

// Placeholder data for invoice templates
const templates = [
  { id: 1, name: "Modern Minimalist", description: "Clean, professional, and straight to the point.", isDefault: true, imageColor: "bg-primary/20" },
  { id: 2, name: "Classic Corporate", description: "Traditional layout with space for a large logo.", isDefault: false, imageColor: "bg-amber-500/20" },
  { id: 3, name: "Dark & Bold", description: "High-contrast design for a unique, memorable look.", isDefault: false, imageColor: "bg-slate-500/20" },
  { id: 4, name: "Service Itemized", description: "Optimized for detailed time and service billing.", isDefault: false, imageColor: "bg-green-500/20" },
];

export default function TemplateList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    console.log("Toggle filter options. Current state:", !isFilterOpen);
  };

  return (
    <main className="flex-grow">
      {/* Header Title Section */}


       <section className="px-4 pt-5 pb-5">
        <div className="flex items-center justify-between"> {/* Flex container for title and button */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Invoice Templates</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1"> Select a template for your new invoices </p>
          </div>
          <Link
            href="/invoices/create" // The path to your new screen
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
            aria-label="Create new client"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Search and Filter Button Section */}
      <section className="px-4 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Input
              className="w-full h-12 rounded-full border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-card-dark dark:text-white dark:placeholder:text-slate-500"
              placeholder="Search template styles..."
              type="text"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              {/* Search Icon (Lucide) */}
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
          {/* Filter Button */}
          <button
            onClick={toggleFilter}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${isFilterOpen
                ? 'bg-primary text-white dark:bg-primary'
                : 'bg-white text-slate-500 shadow-sm border border-slate-200 dark:bg-card-dark dark:text-slate-400 dark:border-slate-700'
              }`}
            aria-expanded={isFilterOpen}
            aria-controls="filter-options"
          >
            {/* Sliders Icon (Lucide) */}
            <SlidersHorizontal className="h-6 w-6" />
          </button>
        </div>

        {/* Filter Options (Conditionally rendered) */}
        <div
          id="filter-options"
          className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="space-y-3 rounded-xl bg-white p-4 shadow dark:bg-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-white">Filter Templates</h3>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-white shadow-sm">
                All
              </button>
              <button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                Default
              </button>
              <button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                New
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Template List Section */}
      <section className="px-4 pb-20">
        <div className="space-y-4">
          {templates.map((template) => (
            <Link
              href={`/templates/${template.id}`} // Link to template preview/selection screen
              key={template.id}
              className="block rounded-xl bg-white p-4 border border-slate-200 transition-shadow hover:shadow-lg dark:bg-slate-800 dark:border-slate-700"
            >
              <div className="flex items-start gap-4">
                {/* Template Icon/Visual Placeholder */}
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg ${template.imageColor} text-slate-800 dark:text-white`}>
                  <LayoutTemplate className="h-8 w-8 text-primary" />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      {template.name}
                    </p>
                    {template.isDefault && (
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 fill-green-100 dark:fill-green-900" />
                        Default
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {template.description}
                  </p>

                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="text-primary text-sm font-semibold hover:underline">
                  Preview & Select
                </button>
              </div>
            </Link>
          ))}

          {/* Call to action for custom template */}
          <div className="pt-4 text-center">
            <Link href="/new-template" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:text-primary dark:hover:text-primary transition-colors">
              <Plus className="h-5 w-5" />
              Create a Custom Template
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}