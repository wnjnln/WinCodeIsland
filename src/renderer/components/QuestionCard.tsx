import { useState, useRef, useEffect } from 'react'

interface AskQuestionItem {
  payload: {
    question: string
    options?: string[]
    descriptions?: string[]
    header?: string
  }
  answerKey: string
  multiSelect: boolean
}

interface QuestionCardProps {
  question?: string
  options?: string[]
  descriptions?: string[]
  allQuestions?: AskQuestionItem[]
  onAnswer: (answer: string) => void
  onSkip: () => void
  onMultiAnswer: (answers: Record<string, string>) => void
}

function PixelButton({
  label,
  onClick,
  bg,
  border,
  fg = 'rgba(255,255,255,0.95)',
  disabled = false,
}: {
  label: string
  onClick: () => void
  bg: string
  border: string
  fg?: string
  disabled?: boolean
}) {
  const [hovering, setHovering] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="flex-1 px-2 py-[7px] rounded-[4px] text-[10px] font-semibold tracking-wide transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        color: fg,
        backgroundColor: hovering ? bg : `${bg}cc`,
        border: `1px solid ${hovering ? border : `${border}66`}`,
        fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace',
      }}
    >
      {label}
    </button>
  )
}

function OptionRow({
  index,
  label,
  description,
  isSelected,
  onClick,
}: {
  index: number
  label: string
  description?: string
  isSelected: boolean
  onClick: () => void
}) {
  const [hovering, setHovering] = useState(false)
  const cyan = 'rgba(102, 178, 255, 1)'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="w-full text-left transition-all duration-150 rounded-[4px]"
      style={{
        backgroundColor: isSelected ? 'rgba(102,178,255,0.08)' : hovering ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isSelected ? 'rgba(102,178,255,0.4)' : hovering ? 'rgba(102,178,255,0.2)' : 'transparent'}`,
      }}
    >
      <div className="flex items-start gap-2 px-2.5 py-[7px]">
        <span
          className="text-[9px] font-bold shrink-0 w-[10px] text-center"
          style={{ color: cyan, fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}
        >
          {hovering ? '▸' : ' '}
        </span>
        <span
          className="text-[10px] font-semibold shrink-0 w-[18px]"
          style={{ color: isSelected || hovering ? cyan : 'rgba(102,178,255,0.6)', fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}
        >
          {index > 0 ? `${index}.` : '…'}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span
            className="text-[10.5px]"
            style={{
              color: 'rgba(255,255,255,' + (hovering || isSelected ? '1' : '0.75') + ')',
              fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace',
              fontWeight: hovering ? 600 : 400,
            }}
          >
            {label}
          </span>
          {description && (
            <span className="text-[9px] line-clamp-2" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}>
              {description}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function MultiSelectRow({
  index,
  label,
  description,
  isChecked,
  onClick,
}: {
  index: number
  label: string
  description?: string
  isChecked: boolean
  onClick: () => void
}) {
  const [hovering, setHovering] = useState(false)
  const cyan = 'rgba(102, 178, 255, 1)'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="w-full text-left transition-all duration-150 rounded-[4px]"
      style={{
        backgroundColor: isChecked ? 'rgba(102,178,255,0.08)' : hovering ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isChecked ? 'rgba(102,178,255,0.4)' : hovering ? 'rgba(102,178,255,0.2)' : 'transparent'}`,
      }}
    >
      <div className="flex items-start gap-2 px-2.5 py-[7px]">
        <span className="shrink-0 w-[14px] text-[11px]" style={{ color: isChecked ? cyan : 'rgba(255,255,255,0.4)' }}>
          {isChecked ? '☑' : '☐'}
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span
            className="text-[10.5px]"
            style={{
              color: 'rgba(255,255,255,' + (hovering || isChecked ? '1' : '0.75') + ')',
              fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace',
              fontWeight: hovering ? 600 : 400,
            }}
          >
            {label}
          </span>
          {description && (
            <span className="text-[9px] line-clamp-2" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}>
              {description}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function TextInputRow({
  placeholder,
  onSubmit,
}: {
  placeholder: string
  onSubmit: (value: string) => void
}) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px]" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <span className="text-[10px] font-bold shrink-0" style={{ color: '#4CD964', fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}>&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) {
            onSubmit(value.trim())
          }
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[10.5px] outline-none placeholder:text-white/30"
        style={{ color: 'rgba(255,255,255,1)', fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}
      />
    </div>
  )
}

export function QuestionCard({
  question,
  options,
  descriptions,
  allQuestions,
  onAnswer,
  onSkip,
  onMultiAnswer,
}: QuestionCardProps) {
  const cyan = 'rgba(102, 178, 255, 1)'

  // Multi-question wizard state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [collectedAnswers, setCollectedAnswers] = useState<Record<string, string>>({})
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [otherText, setOtherText] = useState('')

  const isAskUserQuestion = allQuestions && allQuestions.length > 0

  // Current item for AskUserQuestion mode
  const currentItem = isAskUserQuestion && allQuestions
    ? allQuestions[currentQuestionIndex]
    : null

  // Legacy single question
  const currentQuestionText = currentItem?.payload.question ?? question ?? ''
  const currentOptions = currentItem?.payload.options ?? options
  const currentDescriptions = currentItem?.payload.descriptions ?? descriptions
  const isMultiSelect = currentItem?.multiSelect ?? false
  const header = currentItem?.payload.header

  const totalQuestions = allQuestions?.length ?? 1

  function resetState() {
    setSelectedIndex(null)
    setSelectedIndices(new Set())
    setShowOtherInput(false)
    setOtherText('')
  }

  function advanceWithAnswer(answer: string) {
    if (currentItem) {
      const newAnswers = { ...collectedAnswers, [currentItem.answerKey]: answer }
      setCollectedAnswers(newAnswers)

      if (currentQuestionIndex + 1 < (allQuestions?.length ?? 0)) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        resetState()
      } else {
        onMultiAnswer(newAnswers)
      }
    } else {
      onAnswer(answer)
    }
  }

  function confirmMultiSelect() {
    if (!currentOptions) return
    const parts: string[] = []
    selectedIndices.forEach((idx) => {
      if (currentOptions[idx]) parts.push(currentOptions[idx])
    })
    if (showOtherInput && otherText.trim()) {
      parts.push(otherText.trim())
    }
    if (parts.length === 0) return
    advanceWithAnswer(parts.join(', '))
  }

  function goBack() {
    if (currentQuestionIndex > 0) {
      const prevItem = allQuestions![currentQuestionIndex - 1]
      const newAnswers = { ...collectedAnswers }
      delete newAnswers[prevItem.answerKey]
      setCollectedAnswers(newAnswers)
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      resetState()
    }
  }

  function handleSkip() {
    if (currentItem) {
      const newAnswers = { ...collectedAnswers, [currentItem.answerKey]: '' }
      setCollectedAnswers(newAnswers)
      if (currentQuestionIndex + 1 < (allQuestions?.length ?? 0)) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        resetState()
      } else {
        onMultiAnswer(newAnswers)
      }
    } else {
      onSkip()
    }
  }

  return (
    <div className="flex flex-col gap-2 py-2.5">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3.5">
        <span className="text-[11px] font-bold" style={{ color: cyan, fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}>?</span>
        {header && (
          <span
            className="text-[9px] font-bold px-1 py-[1px] rounded-[3px]"
            style={{ color: 'rgba(102,178,255,0.7)', backgroundColor: 'rgba(102,178,255,0.1)', fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}
          >
            {header}
          </span>
        )}
        <span className="text-[11px] font-medium flex-1 min-w-0 line-clamp-3" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}>
          {currentQuestionText}
        </span>
        {totalQuestions > 1 && (
          <span
            className="text-[9px] font-bold px-1 py-[1px] rounded-[3px] shrink-0"
            style={{ color: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.1)', fontFamily: '"Cascadia Code", "Microsoft YaHei", monospace' }}
          >
            {currentQuestionIndex + 1}/{totalQuestions}
          </span>
        )}
      </div>

      {/* Options or Text Input */}
      {currentOptions && currentOptions.length > 0 ? (
        <div className="flex flex-col gap-1 px-3.5">
          {currentOptions.map((opt, idx) => {
            const desc = currentDescriptions?.[idx]
            if (isMultiSelect) {
              return (
                <MultiSelectRow
                  key={idx}
                  index={idx + 1}
                  label={opt}
                  description={desc}
                  isChecked={selectedIndices.has(idx)}
                  onClick={() => {
                    const next = new Set(selectedIndices)
                    if (next.has(idx)) next.delete(idx)
                    else next.add(idx)
                    setSelectedIndices(next)
                  }}
                />
              )
            }
            return (
              <OptionRow
                key={idx}
                index={idx + 1}
                label={opt}
                description={desc}
                isSelected={selectedIndex === idx}
                onClick={() => {
                  setSelectedIndex(idx)
                  setShowOtherInput(false)
                  advanceWithAnswer(opt)
                }}
              />
            )
          })}

          {/* Other option */}
          {isMultiSelect ? (
            <MultiSelectRow
              index={-1}
              label="其他"
              isChecked={showOtherInput}
              onClick={() => {
                setShowOtherInput(!showOtherInput)
                if (showOtherInput) setOtherText('')
              }}
            />
          ) : (
            <OptionRow
              index={-1}
              label="其他"
              isSelected={showOtherInput}
              onClick={() => {
                setShowOtherInput(true)
                setSelectedIndex(null)
              }}
            />
          )}

          {/* Other text input */}
          {showOtherInput && (
            <div className="mt-1">
              <TextInputRow
                placeholder="输入答案..."
                onSubmit={(val) => {
                  if (!isMultiSelect) advanceWithAnswer(val)
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="px-3.5">
          <TextInputRow
            placeholder="输入答案..."
            onSubmit={(val) => advanceWithAnswer(val)}
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-1.5 px-3.5 pt-1">
        {isAskUserQuestion && currentQuestionIndex > 0 && (
          <PixelButton
            label="返回"
            onClick={goBack}
            bg="rgba(255,255,255,0.06)"
            border="rgba(255,255,255,0.12)"
            fg="rgba(255,255,255,0.6)"
          />
        )}
        <PixelButton
          label="跳过"
          onClick={handleSkip}
          bg="rgba(255,255,255,0.06)"
          border="rgba(255,255,255,0.12)"
          fg="rgba(255,255,255,0.6)"
        />
        {isMultiSelect && (
          <PixelButton
            label="确认"
            onClick={confirmMultiSelect}
            bg="rgba(40,97,45,1)"
            border="rgba(70,158,80,1)"
            disabled={selectedIndices.size === 0 && !(showOtherInput && otherText.trim())}
          />
        )}
        {!isMultiSelect && (!currentOptions || currentOptions.length === 0) && (
          <PixelButton
            label="提交"
            onClick={() => {
              const val = showOtherInput ? otherText.trim() : ''
              if (val) advanceWithAnswer(val)
            }}
            bg="rgba(40,97,45,1)"
            border="rgba(70,158,80,1)"
          />
        )}
      </div>
    </div>
  )
}
