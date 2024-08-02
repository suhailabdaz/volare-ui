import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

function ProfileDetails() {
  const airlineData = useSelector(
    (state: RootState) => state.AirlineAuth.airlineData
  );

  return (
    <div
      className="flex justify-start font-Durk_bold_italic_1000 w-[50%]   my-5 "
      id="profile"
    >
      <div className="bg-transparent  rounded-xl  ">
        <div className=" py-6">
          <div className="flex justify-between"></div>
          <div className=" mt-8  text-white text-xs">
            <ul className="space-y-6">
              <li>
                <div className="flex mb-4 items-start  ">
                  <span className="w-[100%] text-xs break-words font-Durk_bold_400 font-light">
                    The{' '}
                    <span className="font-Durk_bold_italic_1000 text-2xl text-white">
                      {airlineData?.airline_code}
                    </span>{' '}
                    serves as the unique identifier for your airline,
                    functioning as a distinctive code that represents your
                    airline within our system. This code is crucial for
                    administrative and operational processes, ensuring that all
                    transactions and activities are accurately linked to your
                    specific airline. On the other hand, the{' '}
                    <span className="font-Durk_bold_italic_1000 text-2xl text-white">
                      {airlineData?.airline_email}{' '}
                    </span>
                    is a key credential that you will use to access our system.
                    This email serves as your primary login identifier, allowing
                    you to securely manage your airline's information, access
                    various services, and communicate with our support team if
                    needed. It is essential to keep this email updated and
                    secure, as it is a crucial component of your account's
                    security and accessibility.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
