import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiFillStar, AiOutlineMinus, AiOutlinePlus, AiOutlineStar } from 'react-icons/ai'
import { Product } from '../../components'
import { useStateContext } from '../../context/stateContext'
import { client, urlFor } from '../../lib/client'

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price } = product
  const [index, setIndex] = useState(0)
  const {decQty, incQty, qty, onAdd, setQty, setShowCart} = useStateContext()
  const router = useRouter()

  const handleBuyNow =() =>{
    onAdd(product, qty)
    setShowCart(true)
  }

  useEffect(() => {
    const exitingFunction = () => {
       setQty(1)
       setIndex(0)
    };
    router.events.on('routeChangeStart', exitingFunction );
    return () => {
        router.events.off('routeChangeStart', exitingFunction);
    };
}, []);

  return (
    <div>
      <div className='product-detail-container'>
        <div>
          <div className='image-container'>
            <img src={urlFor(image && image[index])} className='product-detail-image'></img>
          </div>
          <div className='small-images-container'>
            {image?.map((item, i) =>(
              <img
              src={urlFor(item)}
              className ={i== index?'small-image selected-image': 'small-image'}
              onMouseEnter={()=> setIndex(i)}
              />
            ))}
          </div>
        </div>
        <div className='product-detail-desc'>
          <h1>{name}</h1>
          <div className='reviews'>
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiOutlineStar />
          </div>
          <p>
            (20)
          </p>
          <h4>Details:</h4>
          <p>{details}</p>
          <p className='price'>${price}</p>

          <div className='quantity'>
            <h3>Quantity:</h3>
            <p className='quantity-desc'>
              <span className='minus' onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className='num'>
                {qty}
              </span>
              <span className='plus' onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className='buttons'>
            <button type="button" className='add-to-cart' onClick={()=> onAdd(product, qty)}>
              Add to Cart
            </button>
            <button type="button" className='buy-now' onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className='maylike-products-wrapper'>
        <h2> You may also like</h2>
        <div className='marquee'>
          <div className='maylike-products-container track'>
            {products.map((item) => 
              <Product key={item._id} product={item}/>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails

export const getStaticPaths = async () => {
  const query = `*[_type=="product"]{
    slug{
      current
    }
  }`
  const products = await client.fetch(query)
  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current
    }
  }))
  return {
    paths,
    // falback of the paths in this case the mode is blocking
    fallback: 'blocking'
  }
}

// used to fetch data instead of  lifecycle method useEffect
export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type=="product" && slug.current =='${slug}'][0]`
  const productsQuery = '*[_type=="product"]'

  const product = await client.fetch(query)
  const products = await client.fetch(productsQuery)

  // inject data on the component
  return {
    props: {
      products,
      product
    }
  }
}

