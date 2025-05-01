import React from 'react'
import { bagImage, glassesImage, jacketsImage, jeansImage, shoesImage, suitsImage, tshirtsImage,  } from '../../public/getImages'
import CategoryItem from '../components/CategoryItem';

const HomePage = () => {
  const categories = [
    { href: "/jeans", name: "Jeans", imageUrl: jeansImage },
    { href: "/t-shirts", name: "T-shirts", imageUrl: tshirtsImage },
    { href: "/shoes", name: "Shoes", imageUrl: shoesImage },
    { href: "/glasses", name: "Glasses", imageUrl: glassesImage },
    { href: "/jackets", name: "Jackets", imageUrl: jacketsImage },
    { href: "/suits", name: "Suits", imageUrl: suitsImage },
    { href: "/bags", name: "Bags", imageUrl: bagImage },
  ];
  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className='text-center text-5xl sm:text-5xl font-bold text-emerald-400 mb-4'>Explore Our Categories</h1>
        <p className='text-center text-xl text-gray-300 mb-12'>Discover the latest trends in eco-friendly fashion</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {
            categories.map((category) => {
              return (
                <CategoryItem
                  category={category}
                  key={category.name}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default HomePage