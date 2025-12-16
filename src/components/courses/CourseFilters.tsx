import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORY_LABELS, LEVEL_LABELS, CourseCategory, CourseLevel } from '@/types/database';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CourseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: CourseCategory | 'all';
  onCategoryChange: (value: CourseCategory | 'all') => void;
  level: CourseLevel | 'all';
  onLevelChange: (value: CourseLevel | 'all') => void;
  onReset: () => void;
}

export function CourseFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  level,
  onLevelChange,
  onReset,
}: CourseFiltersProps) {
  const hasFilters = search || category !== 'all' || level !== 'all';

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Пошук курсів..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 bg-background"
          />
        </div>

        {/* Category */}
        <Select value={category} onValueChange={(v) => onCategoryChange(v as CourseCategory | 'all')}>
          <SelectTrigger className="w-full lg:w-[200px] h-12 bg-background">
            <SelectValue placeholder="Категорія" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі категорії</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level */}
        <Select value={level} onValueChange={(v) => onLevelChange(v as CourseLevel | 'all')}>
          <SelectTrigger className="w-full lg:w-[180px] h-12 bg-background">
            <SelectValue placeholder="Рівень" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі рівні</SelectItem>
            {Object.entries(LEVEL_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        {hasFilters && (
          <Button variant="outline" onClick={onReset} className="h-12 gap-2">
            <X className="w-4 h-4" />
            Скинути
          </Button>
        )}
      </div>
    </div>
  );
}
