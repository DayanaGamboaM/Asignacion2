import React, { useState, useEffect, useMemo, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';


interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
  };
  alt_description: string;
}

const Home = () => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [page, setPage] = useState(1);

  const loadMoreImages = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos?client_id=UZ2k0BvbdRnEUZKupPKqfU_p73Esu06dv2c_ypPCQ5g&per_page=10&page=${page}`//CAMBIAR "ACCESS_KEY" por el access key de su api
        );
        const data = await response.json();

        // Verificar si la respuesta contiene la propiedad 'errors'
        if ('errors' in data) {
          console.error('La respuesta de la API contiene errores:', data.errors);
        } else {
          // Verificar si la respuesta es un arreglo de objetos
          if (Array.isArray(data)) {
            setImages(prevImages => [...prevImages, ...data]); // Utilizar prevImages en lugar de images
          } else {
            console.error('La respuesta de la API no es un arreglo de objetos:', data);
          }
        }
      } catch (error) {
        console.error('Error al obtener imágenes:', error);
      }
    };
    fetchImages();
  }, [page]);

  const renderedImages = useMemo(
    () =>
      images.map((image) => (
        <Card key={image.id} style={{ width: '18rem', margin: '8px' }}>
          <Card.Img variant="top" src={image.urls.thumb} alt={image.alt_description} width={150} height={300} />
          <Card.Body>
            <Card.Title>{image.alt_description}</Card.Title>
          </Card.Body>
        </Card>
      )),
    [images]
  );

  return (
    <div>
      <h1 className='fs-1 text-center '>Imágenes de Unsplash</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {renderedImages}
      </div>
      <Button variant="outline-light" onClick={loadMoreImages}>Cargar más imágenes</Button>
    </div>
  );
};

export default Home;
