import { Link } from "react-router-dom";
import X from '../../../../assets/images/x-social-media-white-icon.png'
import facebook from '../../../../assets/images/facebook-app-round-white-icon.png'

function Footer() {
  return (
    <footer className=" mt-6 bg-black h-full font-PlusJakartaSans1000 text-white">
      <div className="mx-[13%] flex justify-between py-16 items-center">
        <div className="flex space-x-10">
          <Link to={'/profile'}><img src={X} className="h-8"/></Link>
          <Link to={'/profile'}><img src={facebook} className="h-8"/></Link>
        </div>
        <div className="">&copy;<span>2024 VOLARE PVT. LTD.</span> <br /> <span className="font-PlusJakartaSans font-bold text-sm text-right"> <span className="text-xs font-light">Country</span> INDIA, UAE, SPAIN, USA</span></div>
      </div>
    </footer>
  );
}

export default Footer;
