import {toast} from 'sonner' ;

export const reverseGeocodeForCityCountry = async (latitude: number, longitude: number) => {
  try {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(latitude, longitude);

    return new Promise<{ city: string; country: string }>((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const addressComponents = results[0].address_components;
          let city = '';
          let country = '';

          for (const component of addressComponents) {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('country')) {
              country = component.long_name;
            }
          }

          if (city && country) {
            resolve({ city, country });
          } else {
            reject('City or country not found');
          }
        } else {
          console.error('Geocoding failed:', status, results);
          reject('Getting location failed');
        }
      });
    });
  } catch (error: any) {
    console.error('Geocoding error:', error);
    toast.error('An error occurred while getting the location');
    throw error;
  }
};





export  const geocordLocation = async (locationName: string) => {
    try {
      const geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: locationName }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            console.log(results);
            
            const location = results?.[0].geometry.location;
            const latitude = location.lat();
            const longitude = location.lng();
            resolve({ latitude, longitude });
          } else {
            reject("Google failed");
          }
        });
      });
    } catch (error: any) {
      return error.message;
    }
  };


  export  const location = async (setcenter:any,center:any,map:any,setzoom:any) => {
    console.log("dfsbsdbshd");
    console.log(navigator.geolocation,"from location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setcenter({ lat: latitude, lng: longitude });
          map?.panTo(center);
          setzoom(16);
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }
  };
