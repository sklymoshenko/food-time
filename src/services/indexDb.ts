import { Dispatch, SetStateAction } from 'react'

export type Product = {
  id: string
  inputValue?: string
  title: string
  date: string
  createdAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const browserWindow = window as any
const indexDB = browserWindow.indexedDB || browserWindow.mozIndexDB || browserWindow.webkitIndexDB

export const indexDbInit = () => {
  if (!indexDB) {
    throw new Error('Your browser doesnt support index db! Change it to more modern.')
  }

  const dbOpenRequest: IDBOpenDBRequest = indexDB.open('ProductsDataBase', 1)

  dbOpenRequest.onerror = (e: any) => {
    console.error('Error occured with a indexDB')
    throw new Error(e)
  }

  dbOpenRequest.onupgradeneeded = (e: any) => {
    const db = dbOpenRequest.result
    db.createObjectStore('products', {
      keyPath: 'id',
    })
  }

  dbOpenRequest.onsuccess = (e: any) => {
    console.info('IndexDB successfully created!')
  }
}

export const dbPut = (product: Product, setState: Dispatch<SetStateAction<Product[]>>) => {
  const dbOpenRequest: IDBOpenDBRequest = indexDB.open('ProductsDataBase', 1)

  dbOpenRequest.onsuccess = () => {
    const db = dbOpenRequest.result
    const tx = db.transaction('products', 'readwrite')

    const productsStore = tx.objectStore('products')

    const prodcutsAdd = productsStore.put(product)

    prodcutsAdd.onsuccess = () => {
      tx.oncomplete = () => db.close()
    }

    prodcutsAdd.onerror = (event: any) => {
      throw new Error(event)
    }

    dbGet(setState)
  }
}

export const dbGet = (setState: Dispatch<SetStateAction<Product[]>>) => {
  const dbOpenRequest: IDBOpenDBRequest = indexDB.open('ProductsDataBase', 1)

  dbOpenRequest.onsuccess = () => {
    const db = dbOpenRequest.result
    const tx = db.transaction('products', 'readonly')

    const productsStore = tx.objectStore('products')

    const products = productsStore.getAll()

    products.onsuccess = () => {
      tx.oncomplete = () => {
        setState(products.result)
        db.close()
      }
    }

    products.onerror = (event: any) => {
      throw new Error(event)
    }
  }
}

export const dbDelete = (id: Product['id'], setState: Dispatch<SetStateAction<Product[]>>) => {
  const dbOpenRequest: IDBOpenDBRequest = indexDB.open('ProductsDataBase', 1)

  dbOpenRequest.onsuccess = () => {
    const db = dbOpenRequest.result
    const tx = db.transaction('products', 'readwrite')

    const productsStore = tx.objectStore('products')
    const productDelete = productsStore.delete(id)

    productDelete.onsuccess = () => {
      tx.oncomplete = () => db.close()
    }

    productDelete.onerror = (event: any) => {
      throw new Error(event)
    }

    dbGet(setState)
  }
}
