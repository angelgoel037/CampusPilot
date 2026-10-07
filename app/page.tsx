'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CAMPUS_CATEGORIES,
  CATEGORY_LABELS,
  CampusCategory,
} from '@/src/shared/constants';
import { RecommendationResult, UrgencyLevel } from '@/src/domain/recommendation';
import { CampusItem } from '@/src/domain/campus-item/types';
import { PlanItem, PlanConflict } from '@/src/domain/planning';
import { StudentPreferences } from '@/src/domain/preferences';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDateString, formatTimeString } from '@/src/shared/utils/date';
import {
  Sparkles,
  Compass,
  Calendar,
  Layers,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  SlidersHorizontal,
  Flame,
  Search,
  ExternalLink,
} from 'lucide-react';

const USER_ID = 'student-demo';

export default function CampusPilotApp() {
  const [activeTab, setActiveTab] = useState<'feed' | 'plan' | 'explore' | 'preferences'>('feed');

  // State
  const [forYouFeed, setForYouFeed] = useState<RecommendationResult[]>([]);
  const [importantItems, setImportantItems] = useState<CampusItem[]>([]);
  const [exploreItems, setExploreItems] = useState<CampusItem[]>([]);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [conflicts, setConflicts] = useState<PlanConflict[]>([]);
  const [preferences, setPreferences] = useState<StudentPreferences>({
    userId: USER_ID,
    selectedCategories: ['technical', 'cultural'],
    isOnboardingCompleted: true,
    updatedAt: new Date().toISOString(),
  });

  const [selectedExploreCategory, setSelectedExploreCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSavingPrefs, setIsSavingPrefs] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load Feed and Preferences
  const loadFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/feed?userId=${USER_ID}`);
      const json = await res.json();

      if (json.success) {
        setForYouFeed(json.data.forYou || []);
        setImportantItems(json.data.important || []);
        if (json.data.preferences) {
          setPreferences(json.data.preferences);
        }
      } else {
        setError(json.error || 'Failed to load feed.');
      }
    } catch {
      setError('Network error while loading feed.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load Plan
  const loadPlan = useCallback(async () => {
    try {
      const res = await fetch(`/api/plan?userId=${USER_ID}`);
      const json = await res.json();
      if (json.success) {
        setPlanItems(json.data.items || []);
        setConflicts(json.data.conflicts || []);
      }
    } catch {
      console.error('Failed to load plan');
    }
  }, []);

  // Load Explore Items
  const loadExploreItems = useCallback(async (cat?: string, query?: string) => {
    try {
      let url = '/api/items';
      const params = new URLSearchParams();
      if (cat && cat !== 'all') params.append('category', cat);
      if (query) params.append('searchQuery', query);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setExploreItems(json.data || []);
      }
    } catch {
      console.error('Failed to load explore items');
    }
  }, []);

  useEffect(() => {
    loadFeed();
    loadPlan();
    loadExploreItems();
  }, [loadFeed, loadPlan, loadExploreItems]);

  // Add Item to Plan
  const handleAddToPlan = async (campusItemId: string) => {
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, campusItemId }),
      });
      const json = await res.json();
      if (json.success) {
        setPlanItems(json.data.plan.items || []);
        setConflicts(json.data.plan.conflicts || []);
      }
    } catch {
      alert('Failed to add item to plan.');
    }
  };

  // Remove Item from Plan
  const handleRemoveFromPlan = async (campusItemId: string) => {
    try {
      const res = await fetch(`/api/plan?userId=${USER_ID}&campusItemId=${campusItemId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setPlanItems(json.data.plan.items || []);
        setConflicts(json.data.plan.conflicts || []);
      }
    } catch {
      alert('Failed to remove item from plan.');
    }
  };

  // Toggle Category Preference
  const handleToggleCategory = (category: CampusCategory) => {
    const current = preferences.selectedCategories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];

    setPreferences({
      ...preferences,
      selectedCategories: updated,
    });
  };

  // Save Preferences
  const handleSavePreferences = async () => {
    try {
      setIsSavingPrefs(true);
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preferences,
          isOnboardingCompleted: true,
        }),
      });
      const json = await res.json();
      if (json.success) {
        await loadFeed();
        setActiveTab('feed');
      }
    } catch {
      alert('Failed to save preferences.');
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const isItemInPlan = (itemId: string) =>
    planItems.some((p) => p.campusItemId === itemId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                CampusPilot
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Explainable Ranking
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'feed'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              For You
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition relative ${
                activeTab === 'plan'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              My Plan ({planItems.length})
              {conflicts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'explore'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Explore
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'preferences'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Interests
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadFeed} className="underline text-xs font-bold">
              Retry
            </button>
          </div>
        )}

        {/* TAB 1: FOR YOU FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-8">
            {/* Critical Campus Notices Bar */}
            {importantItems.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold tracking-wide uppercase text-amber-300">
                    Important Campus Channel
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importantItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-slate-900 border border-amber-500/30 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <StatusBadge importance={item.importance} />
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatDateString(item.date)}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-100 text-sm">{item.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <span className="text-slate-400">By {item.organizer}</span>
                        <button
                          onClick={() => handleAddToPlan(item.id)}
                          disabled={isItemInPlan(item.id)}
                          className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition ${
                            isItemInPlan(item.id)
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {isItemInPlan(item.id) ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> In Plan
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" /> Add to Plan
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Personalized Feed Stream */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    For You — Ranked Recommendations
                  </h2>
                  <p className="text-xs text-slate-400">
                    Transparent ranking based on your interests, event timing, urgency, and discovery.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className="text-xs text-indigo-400 hover:underline font-semibold"
                >
                  Edit Interests ({preferences.selectedCategories.length})
                </button>
              </div>

              {isLoading ? (
                <div className="py-16 text-center text-slate-500 text-sm">
                  Calculating personalized recommendations...
                </div>
              ) : forYouFeed.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
                  <p className="text-slate-300 font-medium text-sm">
                    Nothing matched your interests yet.
                  </p>
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="text-xs text-indigo-400 underline font-semibold"
                  >
                    Explore all campus activities
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forYouFeed.map((result) => (
                    <RecommendationCard
                      key={result.item.id}
                      result={result}
                      isInPlan={isItemInPlan(result.item.id)}
                      onAddToPlan={() => handleAddToPlan(result.item.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: MY PLAN & CONFLICT DETECTOR */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                My Plan & Schedule
              </h2>
              <p className="text-xs text-slate-400">
                Your personal campus calendar with automatic time-conflict detection.
              </p>
            </div>

            {/* Conflict Warnings */}
            {conflicts.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{conflicts.length} Schedule Conflict(s) Detected</span>
                </div>
                <ul className="space-y-1.5 text-xs text-rose-300/90 list-disc list-inside">
                  {conflicts.map((conflict, idx) => (
                    <li key={idx}>{conflict.reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Plan Items List */}
            {planItems.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-300">No activities planned yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse the For You feed or Explore catalog to add events, hackathons, and workshops to your personal schedule.
                </p>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
                >
                  Discover Events
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {planItems.map((planItem) => {
                  const hasItemConflict = conflicts.some(
                    (c) =>
                      c.itemA.id === planItem.campusItemId ||
                      c.itemB.id === planItem.campusItemId
                  );

                  return (
                    <div
                      key={planItem.id}
                      className={`p-4 rounded-2xl bg-slate-900/80 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        hasItemConflict
                          ? 'border-rose-500/40 bg-rose-950/10'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {CATEGORY_LABELS[planItem.item.category]?.icon}{' '}
                            {CATEGORY_LABELS[planItem.item.category]?.label}
                          </span>
                          {hasItemConflict && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Time Conflict
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-slate-100">
                          {planItem.item.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                            {formatDateString(planItem.item.date)}
                          </span>
                          {planItem.item.startTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" />
                              {formatTimeString(planItem.item.startTime)} -{' '}
                              {formatTimeString(planItem.item.endTime)}
                            </span>
                          )}
                          {planItem.item.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                              {planItem.item.venue}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {planItem.item.registrationUrl && (
                          <a
                            href={planItem.item.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleRemoveFromPlan(planItem.campusItemId)}
                          className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXPLORE CATALOG */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                Explore Campus Activities
              </h2>
              <p className="text-xs text-slate-400">
                Browse all verified campus events, hackathons, sports, cultural activities, and official notices.
              </p>
            </div>

            {/* Filter Chips & Search Bar */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <input
                  type="text"
                  placeholder="Search by title, description, organizer, or tags..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    loadExploreItems(selectedExploreCategory, e.target.value);
                  }}
                  className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                <button
                  onClick={() => {
                    setSelectedExploreCategory('all');
                    loadExploreItems('all', searchQuery);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
                    selectedExploreCategory === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  All Categories
                </button>
                {CAMPUS_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedExploreCategory(cat);
                      loadExploreItems(cat, searchQuery);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition flex items-center gap-1.5 ${
                      selectedExploreCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>{CATEGORY_LABELS[cat]?.icon}</span>
                    <span>{CATEGORY_LABELS[cat]?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Explore Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exploreItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {CATEGORY_LABELS[item.category]?.icon} {CATEGORY_LABELS[item.category]?.label}
                      </span>
                      <StatusBadge importance={item.importance} />
                    </div>
                    <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {formatDateString(item.date)}
                      </span>
                      {item.startTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          {formatTimeString(item.startTime)}
                        </span>
                      )}
                      {item.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          {item.venue}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">By {item.organizer}</span>
                    <button
                      onClick={() => handleAddToPlan(item.id)}
                      disabled={isItemInPlan(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1 transition ${
                        isItemInPlan(item.id)
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {isItemInPlan(item.id) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> In Plan
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add to Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT PREFERENCES / ONBOARDING */}
        {activeTab === 'preferences' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                Personalize Your Campus Experience
              </h2>
              <p className="text-xs text-slate-400">
                Select the themes you care about. Our recommendation engine will rank relevant events at the top of your feed.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {CAMPUS_CATEGORIES.map((cat) => {
                const isSelected = preferences.selectedCategories.includes(cat);
                const info = CATEGORY_LABELS[cat];

                return (
                  <button
                    key={cat}
                    onClick={() => handleToggleCategory(cat)}
                    className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-100 shadow-sm'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                        {info.icon}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">{info.label}</h4>
                        <p className="text-xs text-slate-500">{info.description}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'border-slate-700 bg-slate-950'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSavePreferences}
                disabled={isSavingPrefs}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {isSavingPrefs ? 'Saving...' : 'Save & Refresh Feed'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        CampusPilot · Personalized discovery · Explainable recommendations · Smart planning
      </footer>
    </div>
  );
}

/**
 * RecommendationCard
 * Displays item, score badge, urgency pill, and explainable reasons generated by WeightedRecommendationEngine.
 */
function RecommendationCard({
  result,
  isInPlan,
  onAddToPlan,
}: {
  result: RecommendationResult;
  isInPlan: boolean;
  onAddToPlan: () => void;
}) {
  const { item, score, reasons, urgency } = result;

  const urgencyPill = (level: UrgencyLevel) => {
    if (level === 'urgent') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
          🔥 Urgent
        </span>
      );
    }
    if (level === 'soon') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          ⏳ Closing Soon
        </span>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
      <div className="space-y-3">
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
            {CATEGORY_LABELS[item.category]?.icon} {CATEGORY_LABELS[item.category]?.label}
          </span>
          <div className="flex items-center gap-1.5">
            {urgencyPill(urgency)}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {score}% Match
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
          <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
        </div>

        {/* Explainable Reasons */}
        {reasons && reasons.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Why Recommended
            </span>
            <ul className="text-xs text-indigo-300/90 space-y-0.5">
              {reasons.slice(0, 2).map((reason, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                  <span className="line-clamp-1">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            {formatDateString(item.date)}
          </span>
          {item.startTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {formatTimeString(item.startTime)}
            </span>
          )}
          {item.venue && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              {item.venue}
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <span className="text-slate-400">By {item.organizer}</span>
        <button
          onClick={onAddToPlan}
          disabled={isInPlan}
          className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1 transition ${
            isInPlan
              ? 'bg-slate-800 text-slate-400'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isInPlan ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> In Plan
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Add to Plan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
