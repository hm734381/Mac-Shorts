# Story 2-2: Visual Keyboard Component

## Story Information
- **Story ID**: Story 2-2
- **Branch**: feature/story-2-2-keyboard-visual
- **Dependencies**: Stories 1-1, 1-3
- **Parallel-safe**: true (after Set 1 completes)
- **Module/area**: /components/keyboard, /lib/keyboard-utils.ts
- **Estimated effort**: 3-4 hours

## Story Description
As a user, I want to see a visual representation of the Mac keyboard with highlighted keys for each shortcut so that I can understand the physical key locations.

## Acceptance Criteria
1. ✅ KeyboardVisualizer component shows Mac keyboard layout
2. ✅ Keys highlight when displaying a shortcut
3. ✅ Supports both modifier keys and regular keys
4. ✅ Responsive sizing for different screens
5. ✅ Shows pressed keys for current shortcut
6. ✅ Distinguishes between left/right modifier keys
7. ✅ Tooltips show key names on hover
8. ✅ Smooth highlighting animations
9. ✅ Works with all shortcut combinations
10. ✅ Accessible keyboard navigation

## Technical Implementation Details

### KeyboardVisualizer Component
```typescript
"use client"

import { KeyCombination } from "@/types/shortcut"
import { cn } from "@/lib/utils"

interface KeyboardVisualizerProps {
  keys?: KeyCombination
  className?: string
}

export function KeyboardVisualizer({ keys, className }: KeyboardVisualizerProps) {
  const isKeyHighlighted = (keyId: string): boolean => {
    if (!keys) return false
    
    const modifierMap: Record<string, string[]> = {
      cmd: ['cmd-left', 'cmd-right'],
      option: ['option-left', 'option-right'],
      ctrl: ['ctrl-left', 'ctrl-right'],  
      shift: ['shift-left', 'shift-right']
    }
    
    // Check modifiers
    for (const modifier of keys.modifiers) {
      if (modifierMap[modifier]?.includes(keyId)) return true
    }
    
    // Check main key
    return keyId === keys.key.toLowerCase()
  }

  return (
    <div className={cn("bg-card border rounded-lg p-4", className)}>
      <svg viewBox="0 0 800 300" className="w-full h-auto">
        {/* Keyboard layout with key positions */}
        <MacKeyboardLayout isKeyHighlighted={isKeyHighlighted} />
      </svg>
    </div>
  )
}
```

### Testing Checklist
- [ ] Keyboard displays correctly on all screen sizes
- [ ] Keys highlight for different shortcut combinations  
- [ ] Modifier keys work (cmd, option, ctrl, shift)
- [ ] Tooltips appear on hover
- [ ] Animation smooth when switching shortcuts
- [ ] No visual glitches or layout breaks