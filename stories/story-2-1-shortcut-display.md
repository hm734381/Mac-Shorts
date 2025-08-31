# Story 2-1: Shortcut Display Components

## Story Information
- **Story ID**: Story 2-1
- **Branch**: feature/story-2-1-shortcut-display
- **Dependencies**: Stories 1-1, 1-2, 1-3
- **Parallel-safe**: true (after Set 1 completes)
- **Module/area**: /components/shortcuts, /app/learn
- **Estimated effort**: 4-5 hours

## Story Description
As a user, I want to browse and view Mac keyboard shortcuts organized by category with search and filter capabilities so that I can easily find and learn specific shortcuts.

## Acceptance Criteria
1. ✅ ShortcutCard component displays shortcut information clearly
2. ✅ CategoryGrid shows all categories with icons and counts
3. ✅ ShortcutList displays filtered shortcuts
4. ✅ Search functionality finds shortcuts by name, description, or tags
5. ✅ Filter by difficulty level works
6. ✅ Filter by category works
7. ✅ Keyboard symbols display correctly (⌘, ⌥, ⌃, ⇧)
8. ✅ Learn page layout implemented
9. ✅ Responsive design for all components
10. ✅ Loading states for data fetching

## Technical Implementation Details

### 1. Create ShortcutCard Component

**components/shortcuts/shortcut-card.tsx**:
```typescript
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shortcut } from "@/types/shortcut"
import { cn } from "@/lib/utils"

interface ShortcutCardProps {
  shortcut: Shortcut
  className?: string
  onClick?: () => void
}

export function ShortcutCard({ shortcut, className, onClick }: ShortcutCardProps) {
  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-shadow cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{shortcut.name}</CardTitle>
          <div className="flex gap-2">
            <Badge 
              variant="outline" 
              className={difficultyColors[shortcut.difficulty]}
            >
              {shortcut.difficulty}
            </Badge>
            <Badge variant="secondary">
              {shortcut.frequency}
            </Badge>
          </div>
        </div>
        <CardDescription>{shortcut.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-mono font-bold">
            {shortcut.keys.displayFormat}
          </div>
          <div className="flex gap-1">
            {shortcut.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 2. Create CategoryGrid Component

**components/shortcuts/category-grid.tsx**:
```typescript
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Category } from "@/types/shortcut"
import { cn } from "@/lib/utils"
import * as Icons from "lucide-react"

interface CategoryGridProps {
  categories: Category[]
  selectedCategory?: string
  onCategorySelect: (categoryId: string) => void
  shortcutCounts?: Record<string, number>
  progressCounts?: Record<string, number>
}

export function CategoryGrid({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  shortcutCounts = {},
  progressCounts = {}
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const IconComponent = Icons[category.icon as keyof typeof Icons] || Icons.Folder
        const totalShortcuts = shortcutCounts[category.id] || category.shortcutIds.length
        const learnedShortcuts = progressCounts[category.id] || 0
        
        return (
          <Card
            key={category.id}
            className={cn(
              "hover:shadow-lg transition-all cursor-pointer",
              selectedCategory === category.id && "ring-2 ring-primary"
            )}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <IconComponent className="h-8 w-8 text-primary" />
                {learnedShortcuts > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {learnedShortcuts}/{totalShortcuts} learned
                  </div>
                )}
              </div>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {totalShortcuts} shortcuts
                </span>
                {learnedShortcuts > 0 && (
                  <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(learnedShortcuts / totalShortcuts) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
```

### 3. Create ShortcutList Component

**components/shortcuts/shortcut-list.tsx**:
```typescript
"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShortcutCard } from "./shortcut-card"
import { Shortcut, DifficultyLevel } from "@/types/shortcut"
import { Search, Filter, SortAsc } from "lucide-react"

interface ShortcutListProps {
  shortcuts: Shortcut[]
  onShortcutClick?: (shortcut: Shortcut) => void
}

export function ShortcutList({ shortcuts, onShortcutClick }: ShortcutListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | "all">("all")
  const [sortBy, setSortBy] = useState<"name" | "difficulty" | "frequency">("name")

  const filteredAndSortedShortcuts = useMemo(() => {
    let filtered = shortcuts

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(s => s.difficulty === selectedDifficulty)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "difficulty":
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case "frequency":
          const frequencyOrder = { common: 0, occasional: 1, rare: 2 }
          return frequencyOrder[a.frequency] - frequencyOrder[b.frequency]
        default:
          return 0
      }
    })

    return filtered
  }, [shortcuts, searchQuery, selectedDifficulty, sortBy])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <Tabs value={selectedDifficulty} onValueChange={(v) => setSelectedDifficulty(v as DifficultyLevel | "all")}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy("name")}
            className={sortBy === "name" ? "bg-accent" : ""}
          >
            <SortAsc className="h-4 w-4 mr-1" />
            Name
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy("difficulty")}
            className={sortBy === "difficulty" ? "bg-accent" : ""}
          >
            <Filter className="h-4 w-4 mr-1" />
            Difficulty
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedShortcuts.length} of {shortcuts.length} shortcuts
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAndSortedShortcuts.map((shortcut) => (
          <ShortcutCard
            key={shortcut.id}
            shortcut={shortcut}
            onClick={() => onShortcutClick?.(shortcut)}
          />
        ))}
      </div>

      {filteredAndSortedShortcuts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No shortcuts found matching your criteria
        </div>
      )}
    </div>
  )
}
```

### 4. Create Learn Page

**app/learn/page.tsx**:
```typescript
"use client"

import { useState, useEffect } from "react"
import { CategoryGrid } from "@/components/shortcuts/category-grid"
import { ShortcutList } from "@/components/shortcuts/shortcut-list"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllCategories, getAllShortcuts, getShortcutsByCategory } from "@/lib/shortcuts-data"
import { Category, Shortcut } from "@/types/shortcut"
import { ArrowLeft } from "lucide-react"

export default function LearnPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setCategories(getAllCategories())
      setShortcuts(getAllShortcuts())
      setLoading(false)
    }, 500)
  }, [])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setShortcuts(getShortcutsByCategory(categoryId))
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setShortcuts(getAllShortcuts())
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {selectedCategory 
              ? categories.find(c => c.id === selectedCategory)?.name 
              : "Learn Mac Shortcuts"}
          </h1>
          {selectedCategory && (
            <Button
              variant="outline"
              onClick={handleBackToCategories}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          )}
        </div>

        {!selectedCategory ? (
          <>
            <p className="text-muted-foreground">
              Choose a category to explore shortcuts or browse all shortcuts below
            </p>
            <CategoryGrid
              categories={categories}
              onCategorySelect={handleCategorySelect}
            />
            <div className="pt-8">
              <h2 className="text-2xl font-semibold mb-4">All Shortcuts</h2>
              <ShortcutList shortcuts={shortcuts} />
            </div>
          </>
        ) : (
          <ShortcutList shortcuts={shortcuts} />
        )}
      </div>
    </div>
  )
}
```

### 5. Create Key Display Helper

**components/shortcuts/key-display.tsx**:
```typescript
import { cn } from "@/lib/utils"

interface KeyDisplayProps {
  keys: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function KeyDisplay({ keys, className, size = "md" }: KeyDisplayProps) {
  const sizeClasses = {
    sm: "text-sm px-1.5 py-0.5",
    md: "text-base px-2 py-1",
    lg: "text-lg px-3 py-1.5"
  }

  // Split keys into individual key elements
  const keyElements = keys.split(/(?=[⌘⌥⌃⇧])/).filter(Boolean)

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {keyElements.map((key, index) => (
        <kbd
          key={index}
          className={cn(
            "inline-flex items-center justify-center rounded border bg-muted font-mono font-semibold",
            sizeClasses[size]
          )}
        >
          {key}
        </kbd>
      ))}
    </div>
  )
}
```

## Testing Checklist
- [ ] Category grid displays all categories
- [ ] Clicking category filters shortcuts
- [ ] Search finds shortcuts by name, description, and tags
- [ ] Difficulty filter works correctly
- [ ] Sort options work (name, difficulty, frequency)
- [ ] Shortcut cards display all information correctly
- [ ] Keyboard symbols render properly
- [ ] Responsive layout on all screen sizes
- [ ] Loading states display while fetching data
- [ ] Back button returns to category view

## Git Workflow
```bash
# Create worktree for parallel development
git worktree add -b feature/story-2-1-shortcut-display ../mac-shorts-display

# Work in the worktree
cd ../mac-shorts-display

# Make changes and commit
git add .
git commit -m "feat: implement shortcut display components with search and filter"

# Push to remote
git push -u origin feature/story-2-1-shortcut-display
```

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Components render without errors
- [ ] Search and filter functionality working
- [ ] Responsive design implemented
- [ ] No TypeScript errors
- [ ] User can browse shortcuts effectively
- [ ] Ready for practice mode integration

## Notes for AI Agent Implementation
- Use the data layer functions from Story 1-2
- Ensure keyboard symbols display correctly on all platforms
- Implement smooth transitions between views
- Consider performance with large shortcut lists
- Make components reusable for other pages
- Follow established component patterns from Story 1-3