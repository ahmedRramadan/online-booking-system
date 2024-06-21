import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
function Projects() {
    const [properties, setProperties] = useState([]);
    const db = getFirestore();
  
    useEffect(() => {
      const fetchProperties = async () => {
        const propertyCollection = collection(db, 'events'); // 'properties' هو اسم المجموعة في Firestore
        const propertySnapshot = await getDocs(propertyCollection);
        const propertyList = propertySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(propertyList);
      };
  
      fetchProperties();
    }, []);
  
    if (properties.length === 0) {
      return <div>No events found.</div>;
    }
  
    const displayedProperties = properties.slice(0, 10);
  
    return (
      <div id='projects'>
        <div className='projects-box'>
          <h2 className='container display-5 text-white text-center'>Explore Events</h2>
          <div className='projects-container'>
            {displayedProperties.map((property) => (
              <div className='project' key={property.id}>
                {property.images && property.images.length > 0 && (
                  <Image
                    className='project-bg img-fluid'
                    src={property.images[0]}
                    alt={property.name || 'Event'}
                    width={300}
                    height={200}
                    layout="responsive"
                  />
                )}
                <div className='description-project-box'>
                  <h3 className='h3'>{property.name}</h3>
                  <p className='h6'>{property.description}</p>
                  <a className='description-project-link h6' href={`/events/${property.id}`} target='_blank' rel="noopener noreferrer">More details</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
export default Projects;