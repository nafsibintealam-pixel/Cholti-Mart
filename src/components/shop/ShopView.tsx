import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  X, 
  RotateCcw, 
  ChevronRight, 
  Grid, 
  List, 
  Check, 
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES_DATA } from '../../data/categories';
import { ProductCard } from '../product/ProductCard';

export const ShopView: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    navigateTo 
  } = useShop();

  const [priceFilter, setPriceFilter] = useState<number>(5000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Active filter count
  const isFiltered = selectedCategory !== 'All' || selectedSubcategory !== null || priceFilter < 5000 || onlyInStock || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory(null);
    setPriceFilter(5000);
    setOnlyInStock(false);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filtered & Sorted products calculation
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category match
      if (selectedCategory === 'New Arrivals') {
        if (!product.isNewArrival) return false;
      } else if (selectedCategory === 'Special Offers' || selectedCategory === 'Offers') {
        if (!product.isSpecialOffer && !product.oldPrice) return false;
      } else if (selectedCategory === 'Trending') {
        if (!product.isTrending) return false;
      } else if (selectedCategory !== 'All') {
        if (product.category !== selectedCategory) return false;
      }


      // Subcategory match
      if (selectedSubcategory && product.subcategory !== selectedSubcategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesTag = product.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCat && !matchesTag) return false;
      }

      // Price filter
      if (product.price > priceFilter) return false;

      // In stock
      if (onlyInStock && !product.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0; // default
    });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, priceFilter, onlyInStock, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Active category object
  const activeCategoryObj = CATEGORIES_DATA.find(c => c.name === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-4 flex items-center gap-2">
        <button onClick={() => navigateTo('home')} className="hover:text-neutral-700">Home</button>
        <span>/</span>
        <button onClick={() => handleResetFilters()} className="hover:text-neutral-700">Shop</button>
        {selectedCategory !== 'All' && (
          <>
            <span>/</span>
            <span className="text-neutral-800 font-medium">{selectedCategory}</span>
          </>
        )}
      </nav>

      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Showing {filteredProducts.length} results tailored for Bangladeshi customers
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 py-2 px-4 bg-neutral-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Catalog {isFiltered ? '(Active)' : ''}</span>
          </button>
        </div>

        {/* Sorting Dropdown (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-xs text-neutral-500 font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800 font-medium focus:outline-none focus:border-emerald-600 shadow-2xs"
          >
            <option value="default">Default Ranking</option>
            <option value="price-asc">Price: Low to High (৳)</option>
            <option value="price-desc">Price: High to Low (৳)</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* Desktop Sidebar Filters (3 Cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          
          {/* Active Filter summary */}
          {isFiltered && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-900">Filters Active</span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}

          {/* Categories List */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 pb-2 border-b border-neutral-100">
              Product Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubcategory(null);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span>All Categories</span>
                <span className="text-neutral-400">{products.length}</span>
              </button>

              {CATEGORIES_DATA.map(cat => (
                <div key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedSubcategory(null);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-neutral-400">{cat.itemCount}</span>
                  </button>

                  {/* Subcategories when active */}
                  {selectedCategory === cat.name && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-emerald-200 ml-2 mt-1">
                      {cat.subcategories.map(sub => (
                        <button
                          key={sub}
                          onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                          className={`w-full text-left py-1 text-[11px] block transition-colors ${
                            selectedSubcategory === sub
                              ? 'text-emerald-700 font-bold'
                              : 'text-neutral-500 hover:text-neutral-800'
                          }`}
                        >
                          • {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-2 border-b border-neutral-100 flex items-center justify-between">
              <span>Max Price</span>
              <span className="text-emerald-700 font-extrabold text-sm">৳{priceFilter.toLocaleString()}</span>
            </h3>

            <input
              type="range"
              min={500}
              max={5000}
              step={100}
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>৳500</span>
              <span>৳2,500</span>
              <span>৳5,000</span>
            </div>

            {/* Price Presets */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setPriceFilter(999)}
                className={`text-[11px] py-1 px-2 rounded-lg border text-center transition-colors ${
                  priceFilter === 999 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Under ৳999
              </button>
              <button
                type="button"
                onClick={() => setPriceFilter(2000)}
                className={`text-[11px] py-1 px-2 rounded-lg border text-center transition-colors ${
                  priceFilter === 2000 ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Under ৳2,000
              </button>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 pb-2 border-b border-neutral-100">
              Availability
            </h3>
            <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>In Stock in Dhaka Warehouse only</span>
            </label>
          </div>

          {/* Help Callout */}
          <div className="bg-neutral-900 text-white rounded-2xl p-4 text-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Courier Delivery</span>
            <p className="text-neutral-300">
              All items are dispatched within 24 hours of confirmation. Cash on delivery available.
            </p>
          </div>

        </aside>

        {/* Product Grid Area (9 Cols) */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Active Category Header Banner if selected */}
          {activeCategoryObj && (
            <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Category Showcase</span>
                <h2 className="text-xl sm:text-2xl font-bold mt-1">{activeCategoryObj.name}</h2>
                <p className="text-xs text-neutral-300 mt-1 max-w-md">
                  {activeCategoryObj.subcategories.join(' • ')}
                </p>
              </div>
              <img
                src={activeCategoryObj.image}
                alt={activeCategoryObj.name}
                className="w-24 h-24 object-cover rounded-xl border-2 border-neutral-700/60 shrink-0"
              />
            </div>
          )}

          {/* Search Query Tag Pill */}
          {searchQuery.trim() && (
            <div className="flex items-center gap-2 text-xs bg-neutral-100 p-3 rounded-xl">
              <span className="text-neutral-600">Search results for:</span>
              <strong className="text-neutral-900">"{searchQuery}"</strong>
              <button
                onClick={() => setSearchQuery('')}
                className="ml-auto p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Product Grid: 4 cols on desktop, 3 on tablet, 2 on mobile */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* No Results Found State */
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">No matching products found</h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
                Try adjusting your price filter, clearing active search keywords, or selecting a broader category.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl"
                >
                  Browse All Categories
                </button>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-neutral-200 flex items-center justify-between text-xs">
              <span className="text-neutral-500">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 font-medium"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-neutral-900 text-white' 
                        : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 text-sm">Filter Products</h3>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Category */}
              <div>
                <span className="text-xs font-bold text-neutral-900 uppercase block mb-2">Category</span>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory('All'); setSelectedSubcategory(null); }}
                    className={`w-full text-left py-1 text-xs ${selectedCategory === 'All' ? 'font-bold text-emerald-700' : 'text-neutral-600'}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES_DATA.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.name); setSelectedSubcategory(null); }}
                      className={`w-full text-left py-1 text-xs ${selectedCategory === c.name ? 'font-bold text-emerald-700' : 'text-neutral-600'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <span className="text-xs font-bold text-neutral-900 uppercase block mb-2">
                  Max Price: ৳{priceFilter.toLocaleString()}
                </span>
                <input
                  type="range"
                  min={500}
                  max={5000}
                  step={100}
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* In stock */}
              <label className="flex items-center gap-2 text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>In Stock only</span>
              </label>
            </div>

            <div className="p-4 border-t border-neutral-100 grid grid-cols-2 gap-2">
              <button
                onClick={handleResetFilters}
                className="py-2.5 bg-neutral-100 text-neutral-800 text-xs font-bold rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
