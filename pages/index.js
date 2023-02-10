import React from 'react'
import { Product, FooterBanner, HeroBanner } from '../components'
import {client} from '../lib/client'


// products and BannerData are received since they were injected from server side props
const index = ({products, bannerData}) => {
  return (
    <>
    <HeroBanner heroBanner ={bannerData.length && bannerData[0]}/>
    <div className='products-heading'>
      <h2>
        Best selling Products
      </h2>
      <p>
        Speakers of many variations
      </p>
    </div>
    <div className='products-container'>
      {products?.map((product) =><Product
      key={product._id}
      product={product}
      />)}
    </div>
    <FooterBanner footerBanner={bannerData && bannerData[0]}/>
    </>
  )
}
// used to fetch data instead of  lifecycle method useEffect
export const getServerSideProps = async () => {
 const query = '*[_type=="product"]'
 const products = await client.fetch(query)

 const bannerQuery = '*[_type=="banner"]'
 const bannerData = await client.fetch(bannerQuery)

 // inject data on the component
 return {
   props: {
     products,
     bannerData
   }
}
}

export default index