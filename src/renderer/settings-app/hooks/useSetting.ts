import { useState, useEffect, useCallback } from 'react'

export function useSetting<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    let mounted = true
    window.ipcAPI.getSetting(key).then((v) => {
      if (mounted) {
        setValue(v !== undefined ? (v as T) : defaultValue)
      }
    })
    return () => { mounted = false }
  }, [key, defaultValue])

  const updateValue = useCallback((newValue: T) => {
    setValue(newValue)
    window.ipcAPI.setSetting(key, newValue)
  }, [key])

  return [value, updateValue]
}
