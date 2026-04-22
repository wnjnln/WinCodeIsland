import React from 'react'

interface SettingRowProps {
  label: string
  description?: string
  children: React.ReactNode
}

export function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-white/90">{label}</span>
        {description && (
          <span className="text-[11px] text-white/40">{description}</span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
        checked ? 'bg-[#66FF80]/80' : 'bg-white/15'
      }`}
    >
      <span
        className={`absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'left-[22px]' : 'left-[2px]'
        }`}
      />
    </button>
  )
}

interface SelectProps {
  value: string | number
  onChange: (value: string | number) => void
  options: { value: string | number; label: string }[]
}

export function Select({ value, onChange, options }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => {
        const v = e.target.value
        const num = Number(v)
        onChange(Number.isNaN(num) || e.target.value === '' ? v : num)
      }}
      className="bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-[12px] text-white/90 outline-none focus:border-white/25 min-w-[120px]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">
          {opt.label}
        </option>
      ))}
    </select>
  )
}

interface SliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  suffix?: string
}

export function Slider({ value, min, max, step = 1, onChange, suffix }: SliderProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#66FF80]"
      />
      <span className="text-[12px] text-white/70 w-10 text-right">
        {value}{suffix}
      </span>
    </div>
  )
}
