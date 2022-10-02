export type DbId = 'products' | 'productsOptions'

export type InfoSection = 'expiring' | 'inTime' | 'expired'

export type PaletteColorTypes = 'success' | 'error' | 'warning'

export type PaletteColorValueTypes = 'dark' | 'light'

export const DbIdEnum: Record<DbId, DbId> = {
  products: 'products',
  productsOptions: 'productsOptions',
}

export const ExpirationDateRangeEnum: Record<InfoSection, number> = {
  expired: 0,
  expiring: 3,
  inTime: 1000,
}

export type Product = {
  id: string
  inputValue?: string
  title: string
  date: string
  createdAt: string
}

export type ListInfo = Record<InfoSection, Product[]>

export type PaletteColorValues = Record<PaletteColorValueTypes, string>

export type PaletteColors = Record<PaletteColorTypes, PaletteColorValues>
