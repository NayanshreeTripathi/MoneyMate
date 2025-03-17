import React from 'react'

const MainLayout = ({children}) => {
  return (
    <div className='container mx-auto mt-40'>
      {children}
    </div>
  )
}

export default MainLayout
