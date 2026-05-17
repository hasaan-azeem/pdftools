"use client";

import { useState } from "react";
import { TOOLS, CATEGORIES, type ToolCategory } from "@/lib/tools";
import ToolCard from "./ToolCard";

export default function CategoryFilter() {
  const [active, setActive] = useState<ToolCategory>("all");

  const filtered =
    active === "all" ? TOOLS : TOOLS.filter((t) => t.category === active);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              active === cat.id
                ? "bg-brand-600 text-white shadow-sm shadow-brand-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 animate-fade-in">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {/* Count */}
      <p className="mt-6 text-center text-sm text-gray-400">
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""} available
      </p>
    </div>
  );
}
