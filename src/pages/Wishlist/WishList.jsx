import './WishList.css'
import { assets } from '../../assets/assets';

const Wishlist = ({ wishlistItems, closeWishlist }) => {
  return (
    <div className="wishlist-overlay" onClick={closeWishlist}>
      <div className="wishlist-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeWishlist}><img src={assets.crossIcon} alt="" /></button>
        <h2>Your Wishlist</h2>
        {wishlistItems.length > 0 ? (
          <ul>
            {wishlistItems.map((item, index) => (
              <li key={index}>
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <p>{item.name}</p>
                  <p>Price: ${item.price}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in your wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;