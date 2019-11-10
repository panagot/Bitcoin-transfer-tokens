import './card.css';
import React from 'react';

export default ({ artwork }) => {
  const handleClick = () => {
    const publicKey = prompt("Please enter the public key of the new owner")
    artwork.setOwner(publicKey)
  }

  return artwork
    ? (<div className="card" onClick={handleClick}>
        <img src={artwork.url || artwork.imageUrl} alt={artwork.title} />
        <div className="container">
          <b>{artwork.title}</b><br />
          {artwork.artist}<br />
        </div>
      </div>)
    : <div></div>
}