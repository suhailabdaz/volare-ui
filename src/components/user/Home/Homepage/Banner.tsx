import  { useEffect, useState } from 'react';
import { useGetBannersQuery } from '../../../../redux/apis/adminApiSlice';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import createAxios from '../../../../services/axios/UserAxios';
import { airlineEndpoints } from '../../../../services/endpoints/AirlineEndpoints';
import { useDispatch } from 'react-redux';

interface BannerData {
  banner_content: string;
  banner_image_link: string;
  createdAt: string;
  status: boolean;
  updatedAt: string;
  _id: string;
}

function Banner() {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetBannersQuery({});
  const [images, setImages] = useState<string[]>([]);

  const fetchImage = async (imageLink: string): Promise<string> => {
    try {
      const response = await createAxios(dispatch).get<string>(
        airlineEndpoints.getImageLink,
        { params: { key:imageLink } }
      );
      return response.data; 
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  };

  const handleImageError = async (index: number, imageLink: string) => {
    try {
      const newImageSrc = await fetchImage(imageLink);
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index] = newImageSrc;
        return updatedImages;
      });
    } catch (error) {
      console.error("Failed to refetch image:", error);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      Promise.all(data.map((banner: BannerData) => fetchImage(banner.banner_image_link)))
        .then((fetchedImages) => setImages(fetchedImages))
        .catch((err) => console.error("Error fetching images:", err));
    }
  }, [data]);

  if (!data || isLoading || error) {
    return null;
  }

  return (
    <div className="mx-[20%] my-12  text-black text-center rounded">
      <Carousel
        autoPlay
        interval={10000}
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators={false} 
        className="w-full"
      >
        {data.map((banner: BannerData, index: number) => (
          <div key={banner._id}>
            <img
              src={images[index]}
              alt={`Banner ${index}`}
              className="w-full h-auto"
              onError={() => handleImageError(index, banner.banner_image_link)}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Banner;
