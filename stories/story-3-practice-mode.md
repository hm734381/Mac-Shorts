# Story 3: Practice Mode Core

## Story Information
- **Story ID**: Story 3
- **Branch**: feature/story-3-practice-mode
- **Dependencies**: Stories 2-1, 2-2, 2-3
- **Parallel-safe**: false
- **Module/area**: /components/practice, /app/practice, /hooks/use-practice-session.ts
- **Estimated effort**: 5-6 hours

## Story Description
As a user, I want to practice keyboard shortcuts interactively with immediate feedback so that I can test and improve my shortcut knowledge.

## Acceptance Criteria
1. ✅ PracticeSession component with shortcut prompts
2. ✅ Real-time keyboard input detection
3. ✅ Immediate feedback (correct/incorrect)
4. ✅ Session progress tracking
5. ✅ Skip option for unknown shortcuts
6. ✅ Practice by category or all shortcuts
7. ✅ Session length options (5, 10, 20)
8. ✅ Score calculation and display
9. ✅ Review mode for incorrect answers
10. ✅ Progress persistence

## Technical Implementation Details

### PracticeSession Component
```typescript
"use client"

import { useState, useEffect } from 'react'
import { useKeyboardCapture } from '@/hooks/use-keyboard-capture'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'

interface PracticeSessionProps {
  shortcuts: Shortcut[]
  sessionLength: number
}

export function PracticeSession({ shortcuts, sessionLength }: PracticeSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  const currentShortcut = shortcuts[currentIndex]
  
  const { capturedKeys, resetCapture } = useKeyboardCapture()
  
  useEffect(() => {
    if (capturedKeys && currentShortcut) {
      const isCorrect = checkKeyMatch(capturedKeys, currentShortcut.keys)
      setFeedback(isCorrect ? 'correct' : 'incorrect')
      
      if (isCorrect) {
        setScore(prev => prev + 1)
        setTimeout(nextShortcut, 1000)
      }
    }
  }, [capturedKeys, currentShortcut])
  
  const nextShortcut = () => {
    setCurrentIndex(prev => prev + 1)
    setFeedback(null)
    resetCapture()
  }
  
  const progress = ((currentIndex + 1) / sessionLength) * 100
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Progress value={progress} />
      
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {currentShortcut?.name}
          </h2>
          <p className="text-muted-foreground mb-6">
            {currentShortcut?.description}
          </p>
          
          {feedback === 'correct' && (
            <div className="text-green-600 font-bold">✅ Correct!</div>
          )}
          {feedback === 'incorrect' && (
            <div className="text-red-600 font-bold">
              ❌ Incorrect. Try: {currentShortcut?.keys.displayFormat}
            </div>
          )}
          
          <Button onClick={nextShortcut} className="mt-4">
            Skip
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Testing Checklist
- [ ] Keyboard input captured correctly
- [ ] Feedback shows immediately
- [ ] Progress updates properly
- [ ] Session completes successfully
- [ ] Score calculation accurate