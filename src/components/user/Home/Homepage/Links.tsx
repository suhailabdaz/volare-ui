import { Link } from 'react-router-dom';

function Links() {
  return (
    <div className="mx-[13%] my-12 font-PlusJakartaSans  ">
      <div className=" md:flex-row justify-between">
        <div className="mb-3 ">
          <h2 className="text-md font-PlusJakartaSans1000  mb-2">QUICK LINKS</h2>
          <ul className="flex space-x-2 text-sm font-bold text-gray-600">
            <li><Link to={'/airline'}>Airline </Link></li>,
            <li><Link to={'/authority'}>DGCA </Link></li>,
            <li><Link to={'/admin'}>Volare Administartion </Link></li>,
            <li><Link to={'/profile'}>Profile </Link></li>,
            <li><Link to={'/mytrips'}>My trips </Link></li>
          </ul>
        </div>
        <div className="mb-3 ">
  <h2 className="text-md font-PlusJakartaSans1000 mb-2">ABOUT SITE</h2>
  <ul className="flex flex-wrap text-sm font-bold space-x-1 text-gray-600">
    <li ><Link to={'/profile'}>About us</Link></li>,
    <li><Link to={'/profile'}>Customer support</Link></li>,
    <li><Link to={'/profile'}>Terms and conditions</Link></li>,
    <li><Link to={'/profile'}>Travel guidelines</Link></li>,
    <li><Link to={'/profile'}>International travel guidelines</Link></li>,
    <li><Link to={'/profile'}>Cookie policy</Link></li>,
    <li><Link to={'/profile'}>Payment policy</Link></li>,
    <li><Link to={'/profile'}>Privacy policy</Link></li>,
    <li><Link to={'/profile'}>User agreement</Link></li>,
    <li><Link to={'/profile'}>Partners</Link></li>,
    <li><Link to={'/profile'}>Careers</Link></li>,
    <li><Link to={'/profile'}>Report security issues</Link></li>
  </ul>
</div>

      </div>
    </div>
  );
}

export default Links;
