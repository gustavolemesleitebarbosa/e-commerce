import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { AiOutlineShopping } from 'react-icons/ai'
import { useStateContext } from '../context/stateContext'
import { Cart } from './'

const Navbar = () => {
 const { showCart, setShowCart, totalQuantities } = useStateContext()
 const router = useRouter()
  return (
    <div className='navbar-container'>
      <p className='logo'>
      {router.pathname !== '/' &&
        <Link href='/'>
          <p className='home-page'>
             Go to Homepage
          </p>
        </Link>}
      </p>
      <button type='button' className='cart-icon' onClick={()=> setShowCart(true)}>
        <AiOutlineShopping/>
        <span className='cart-item-qty'>
          {totalQuantities}
        </span>
      </button>
      {showCart && <Cart/>}
    </div>
  )
}

export default Navbar