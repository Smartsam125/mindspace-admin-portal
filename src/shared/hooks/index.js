import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Fire-and-forget data fetcher. Re-runs when deps change.
 */
export function useQuery(fn, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fnRef.current()
      setData(res?.data ?? res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { run() }, [run])

  return { data, loading, error, refetch: run }
}

/**
 * Imperative action with loading / error state.
 */
export function useMutation() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const mutate = useCallback(async (fn) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fn()
      return res
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { mutate, loading, error, clearError: () => setError(null) }
}

/**
 * Debounce a value.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}
