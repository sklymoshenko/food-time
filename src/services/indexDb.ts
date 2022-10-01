/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from 'react'

export type Product = {
  id: string
  inputValue?: string
  title: string
  date: string
  createdAt: string
}

export type DbId = 'products' | 'productsOptions'

export enum DbIdEnum {
  products = 'products',
  productsOptions = 'productsOptions',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const browserWindow = window as any
const indexDB = browserWindow.indexedDB || browserWindow.mozIndexDB || browserWindow.webkitIndexDB

const openDb = (): IDBOpenDBRequest => indexDB.open('ProductsDataBase', 2)

export const indexDbInit = (dbId: DbId) => {
  if (!indexDB) {
    throw new Error('Your browser doesnt support index db! Change it to more modern.')
  }

  const dbOpenRequest = openDb()

  dbOpenRequest.onerror = (e: any) => {
    console.error('Error occured with a indexDB')
    throw new Error(e)
  }

  dbOpenRequest.onupgradeneeded = () => {
    const db = dbOpenRequest.result
    db.createObjectStore(dbId, {
      keyPath: 'id',
    })
  }

  dbOpenRequest.onsuccess = () => {
    console.info('IndexDB successfully created!')
  }
}

export const dbPut = (dbId: DbId, product: Product, setState: Dispatch<SetStateAction<Product[]>>) => {
  const dbOpenRequest = openDb()

  dbOpenRequest.onsuccess = () => {
    const db = dbOpenRequest.result
    const tx = db.transaction(dbId, 'readwrite')

    const store = tx.objectStore(dbId)

    const itemsAdd = store.put(product)
    itemsAdd.onsuccess = () => {
      tx.oncomplete = () => db.close()
    }

    itemsAdd.onerror = (e: any) => {
      throw new Error(e)
    }

    dbGet(dbId, setState)
  }
}

export const dbGet = (dbId: DbId, setState: Dispatch<SetStateAction<Product[]>>) => {
  const dbOpenRequest = openDb()

  dbOpenRequest.onsuccess = () => {
    const db = dbOpenRequest.result
    const tx = db.transaction(dbId, 'readonly')

    const store = tx.objectStore(dbId)

    const items = store.getAll()

    items.onsuccess = () => {
      tx.oncomplete = () => {
        setState(items.result)
        db.close()
      }
    }

    items.onerror = (event: any) => {
      throw new Error(event)
    }
  }
}

export const dbDelete = (dbId: DbId, id: Product['id'], setState: Dispatch<SetStateAction<Product[]>>) => {
  const dbOpenRequest = openDb()

  dbOpenRequest.onsuccess = () => {
    const db = dbOpenRequest.result
    const tx = db.transaction(dbId, 'readwrite')

    const store = tx.objectStore(dbId)
    const itemDelete = store.delete(id)

    itemDelete.onsuccess = () => {
      tx.oncomplete = () => db.close()
    }

    itemDelete.onerror = (event: any) => {
      throw new Error(event)
    }

    dbGet(dbId, setState)
  }
}
