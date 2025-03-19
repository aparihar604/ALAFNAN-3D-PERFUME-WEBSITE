// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import './cart.css'
import { StoreContext } from '../../context/storeContext'
import { useNavigate } from 'react-router-dom'
const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount } = useContext(StoreContext)

  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cartItems">
        <div className="cartItemsTitle">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {food_list.map((Items, index) => {
          if (cartItems[Items._id] > 0) {
            return (
              <div key={index}>
                <div className='cartItemsTitle cartItemsItem'>
                  <img src={Items.image} alt="" />
                  <p>{Items.name}</p>
                  <p>${Items.price}</p>
                  <p>{cartItems[Items._id]}</p>
                  <p>${Items.price * cartItems[Items._id]}</p>
                  <p onClick={() => removeFromCart(Items._id)} className='x'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cartBottom">
        <div className="cartTotal">
          <h2>Cart total</h2>
          <div>
            <div className="cartTotalDetails">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartTotalDetails">
              <p>Delivery fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cartTotalDetails">
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
            </div>
          </div>
          <button onClick={()=>getTotalCartAmount()===0?false:navigate('/PlaceOrder')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartPromoCode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cartPromoCodeInput">
              <input type="text" placeholder='Promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
