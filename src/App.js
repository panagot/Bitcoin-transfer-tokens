import React, { useState, useEffect } from 'react'
import Computer from 'bitcoin-computer'
import './App.css'
import Card from './card'
import Artwork from './artwork'

function App() {
  const [computer, setComputer] = useState(new Computer({ seed: 'weasel company neutral unveil burst section sorry case walnut fabric delay scrub father split tomorrow'}))
  const [balance, setBalance] = useState(0)

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [url, setUrl] = useState('')

  const [revs, setRevs] = useState([])
  const [artworks, setArtworks] = useState([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const fetchRevs = async () => {
      setBalance(await computer.db.wallet.getBalance())
      setRevs(await Computer.getOwnedRevs(computer.db.wallet.getPublicKey()))
      setTimeout(() => setRefresh(refresh + 1), 3500)
    }
    fetchRevs()
  }, [computer.db.wallet, refresh])

  useEffect(() => {
    const fetchArtworks = async () => {
      setArtworks(await Promise.all(revs.map(async rev => computer.sync(rev))))
    }
    fetchArtworks()
  }, [revs, computer])

  useEffect(() => console.log('revs', revs), [revs])
  useEffect(() => console.log('artworks', artworks), [artworks])

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    const artwork = await computer.new(Artwork, [title, artist, url])
    console.log('created artwork', artwork)
  }

  return (
    <div className="App">
      <h2>(Δημιουργήθηκε με το NPM Bitcoin-computer που προσωρινά υποστηρίζει μόνο BCH.</h2>
      <h2>Σύντομα θα είναι διαθέσιμο για BTC και όλα τα κρυπτονομίσματα που βασίζονται στο Bitcoin)</h2>
      <h2>Οδηγίες: <a href="https://bitcoin-computer.gitbook.io/docs/">bitcoin-computer.gitbook.io/docs</a> </h2>
      <h2>Πορτοφόλι BCH</h2>
      <b>Διεύθυνση:</b>&nbsp;{computer.db.wallet.getAddress().toString()}<br />
      <b>Δημόσιο κλειδί: </b>&nbsp;{computer.db.wallet.getPublicKey().toString()}<br />
      <b>Υπόλοιπο: </b>&nbsp;{balance}<br />
      <button type="submit" onClick={() => setComputer(new Computer())}>Δημιουργία νέου λογαριασμού</button>

      <h2>Δημιουργία νέας εικόνας</h2>
      <form onSubmit={handleSubmit}>
        Τίτλος<br />
        <input type="string" value={title} onChange={e => setTitle(e.target.value)} />

        Όνομα καλλιτέχνη<br />
        <input type="string" value={artist} onChange={e => setArtist(e.target.value)} />

        Σύνδεσμος φωτογραφίας<br />
        <input type="string" value={url} onChange={e => setUrl(e.target.value)} />

        <button type="submit" value="Send Bitcoin">Δημιουργία εικόνας</button>
      </form>

      <h2>Οι φωτογραφίες σας</h2>
      <ul className="flex-container">
        {artworks.map(artwork => <Card artwork={artwork} key={artwork.title + artwork.artist} />)}
      </ul>
    </div>
  );
}

export default App;
