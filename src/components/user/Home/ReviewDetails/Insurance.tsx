import React from 'react'

interface CouponDetailsProps {
  onUpdateInsurance: (insurance: any) => void; 
}

const Insurance: React.FC<CouponDetailsProps> = ({ onUpdateInsurance }) => {
  return (
    <div>Insurance</div>
  )
}

export default Insurance