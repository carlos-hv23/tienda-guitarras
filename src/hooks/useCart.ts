import { useState, useEffect, useMemo } from "react"
import {db} from '../data/db'
import type { Guitar, CartItem } from "../types"

export const useCart = () => {

    const initialCart = () : CartItem[] => JSON.parse(localStorage.getItem('cart')!) || []

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item : Guitar){

        const itemExist = cart.findIndex((guitar) => guitar.id === item.id)

        if(itemExist >= 0){
            if(cart[itemExist].quantity === MAX_ITEMS){
                console.log('No se pueden agregar mas items')
                return
            }
            console.log('El item ya existe en el carrito')
            const updateCart = [...cart]
            updateCart[itemExist].quantity++
            setCart(updateCart) 
        } else {
            console.log('El item no existe... agregando al carrito')
            const newItem : CartItem = {...item, quantity:1}
            setCart([...cart, newItem])
        }

    }

    function removeFromCart(id : Guitar['id']){
        setCart(prevCart => prevCart.filter((guitar) => guitar.id !== id))
    }

    function increaseQuantity(id : Guitar['id']){
        const updateCart = cart.map((guitar) => {
            if(guitar.id === id && guitar.quantity < MAX_ITEMS){
                guitar.quantity++
            }
            return guitar
        })
        setCart(updateCart)
    }
    function decreaseQuantity(id : Guitar['id']){
        const updateCart = cart.map((guitar) => {
            if(guitar.id === id && guitar.quantity > MIN_ITEMS){
                guitar.quantity--
            }
            return guitar
        })
        setCart(updateCart)
    }

    function clearCart() {
        setCart([])
    }

    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal = useMemo(() => cart.reduce((total,item) => total + (item.quantity * item.price), 0), [cart]);

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}

