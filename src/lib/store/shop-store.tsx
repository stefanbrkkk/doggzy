'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getProduct, type Product } from '@/content/products'

const STORAGE_KEY = 'doggzy.shop.v1'
const MAX_QTY = 99

export interface CartLine {
  productId: string
  quantity: number
}

interface PersistedState {
  lines: CartLine[]
  favorites: string[]
}

interface ShopState extends PersistedState {
  /** False until localStorage has been read, so the UI can avoid a hydration mismatch. */
  hydrated: boolean
}

type Action =
  | { type: 'hydrate'; payload: PersistedState }
  | { type: 'add'; productId: string; quantity: number }
  | { type: 'setQuantity'; productId: string; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }
  | { type: 'toggleFavorite'; productId: string }

const initialState: ShopState = { lines: [], favorites: [], hydrated: false }

function reducer(state: ShopState, action: Action): ShopState {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload, hydrated: true }

    case 'add': {
      const existing = state.lines.find((line) => line.productId === action.productId)
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((line) =>
            line.productId === action.productId
              ? { ...line, quantity: Math.min(MAX_QTY, line.quantity + action.quantity) }
              : line,
          ),
        }
      }
      return {
        ...state,
        lines: [...state.lines, { productId: action.productId, quantity: action.quantity }],
      }
    }

    case 'setQuantity': {
      if (action.quantity <= 0) {
        return { ...state, lines: state.lines.filter((l) => l.productId !== action.productId) }
      }
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.productId === action.productId
            ? { ...line, quantity: Math.min(MAX_QTY, action.quantity) }
            : line,
        ),
      }
    }

    case 'remove':
      return { ...state, lines: state.lines.filter((l) => l.productId !== action.productId) }

    case 'clear':
      return { ...state, lines: [] }

    case 'toggleFavorite': {
      const has = state.favorites.includes(action.productId)
      return {
        ...state,
        favorites: has
          ? state.favorites.filter((id) => id !== action.productId)
          : [...state.favorites, action.productId],
      }
    }

    default:
      return state
  }
}

/** Discards anything that is not a currently known product id. */
function parsePersisted(raw: string): PersistedState | null {
  try {
    const data = JSON.parse(raw) as unknown
    if (typeof data !== 'object' || data === null) return null

    const record = data as Record<string, unknown>
    const lines = Array.isArray(record.lines) ? record.lines : []
    const favorites = Array.isArray(record.favorites) ? record.favorites : []

    return {
      lines: lines
        .filter(
          (line): line is CartLine =>
            typeof line === 'object' &&
            line !== null &&
            typeof (line as CartLine).productId === 'string' &&
            Number.isFinite((line as CartLine).quantity),
        )
        .filter((line) => Boolean(getProduct(line.productId)))
        .map((line) => ({
          productId: line.productId,
          quantity: Math.min(MAX_QTY, Math.max(1, Math.round(line.quantity))),
        })),
      favorites: favorites
        .filter((id): id is string => typeof id === 'string')
        .filter((id) => Boolean(getProduct(id))),
    }
  } catch {
    return null
  }
}

export interface CartEntry {
  product: Product
  quantity: number
  lineTotal: number
}

interface ShopContextValue {
  hydrated: boolean
  entries: CartEntry[]
  favorites: Product[]
  favoriteIds: string[]
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  /** Free shipping kicks in above this threshold, in dinars. */
  freeShippingThreshold: number
  isCartOpen: boolean
  addToCart: (productId: string, quantity?: number, origin?: DOMRect | null) => void
  setQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  openCart: () => void
  closeCart: () => void
  /** Bounding box of the element that last triggered "add to cart", for the fly-to-cart effect. */
  flyOrigin: { rect: DOMRect; key: number } | null
}

const ShopContext = createContext<ShopContextValue | null>(null)

const FREE_SHIPPING_THRESHOLD = 6000
const SHIPPING_COST = 390

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isCartOpen, setCartOpen] = useState(false)
  const [flyOrigin, setFlyOrigin] = useState<{ rect: DOMRect; key: number } | null>(null)
  const flyKey = useRef(0)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? parsePersisted(raw) : null
    dispatch({ type: 'hydrate', payload: parsed ?? { lines: [], favorites: [] } })
  }, [])

  useEffect(() => {
    if (!state.hydrated) return
    const payload: PersistedState = { lines: state.lines, favorites: state.favorites }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Private mode or a full quota — the cart simply stays session-only.
    }
  }, [state.favorites, state.hydrated, state.lines])

  // Keep tabs in sync: a cart edited in one tab shows up in the others.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      const parsed = parsePersisted(event.newValue)
      if (parsed) dispatch({ type: 'hydrate', payload: parsed })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addToCart = useCallback((productId: string, quantity = 1, origin?: DOMRect | null) => {
    if (!getProduct(productId)) return
    dispatch({ type: 'add', productId, quantity })
    if (origin) {
      flyKey.current += 1
      setFlyOrigin({ rect: origin, key: flyKey.current })
    }
  }, [])

  const value = useMemo<ShopContextValue>(() => {
    const entries = state.lines
      .map((line) => {
        const product = getProduct(line.productId)
        if (!product) return null
        return {
          product,
          quantity: line.quantity,
          lineTotal: product.price * line.quantity,
        }
      })
      .filter((entry): entry is CartEntry => entry !== null)

    const subtotal = entries.reduce((sum, entry) => sum + entry.lineTotal, 0)
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

    return {
      hydrated: state.hydrated,
      entries,
      favoriteIds: state.favorites,
      favorites: state.favorites
        .map((id) => getProduct(id))
        .filter((product): product is Product => Boolean(product)),
      itemCount: entries.reduce((sum, entry) => sum + entry.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      isCartOpen,
      addToCart,
      setQuantity: (productId, quantity) => dispatch({ type: 'setQuantity', productId, quantity }),
      removeFromCart: (productId) => dispatch({ type: 'remove', productId }),
      clearCart: () => dispatch({ type: 'clear' }),
      toggleFavorite: (productId) => dispatch({ type: 'toggleFavorite', productId }),
      isFavorite: (productId) => state.favorites.includes(productId),
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      flyOrigin,
    }
  }, [addToCart, flyOrigin, isCartOpen, state.favorites, state.hydrated, state.lines])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop(): ShopContextValue {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used inside <ShopProvider>')
  }
  return context
}
