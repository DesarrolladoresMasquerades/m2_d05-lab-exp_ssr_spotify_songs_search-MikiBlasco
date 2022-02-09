require('dotenv').config();


const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => res.render('index'));

app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.searchString)
  .then(data => {
    let artist = data.body.artists.items
    res.render('artist-search-results', {artist})
    console.log('The received data from the API: ', data.body.artists.items[0].images[0].url)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.all('/albums/:artistId', (req, res) =>{
    const artistId = req.params.artistId
    spotifyApi
    .getAlbum(artistId)
    .then((respondeFromDB) => {
        console.log('Response is: ', respondeFromDB)

    })

})


  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
