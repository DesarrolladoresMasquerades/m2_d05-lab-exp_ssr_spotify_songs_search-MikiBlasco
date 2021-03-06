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
    //console.log('The received data from the API: ', data.body.artists.items)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:albumId', (req, res) =>{
    const albumId = req.params.albumId
    spotifyApi
    .getArtistAlbums(albumId)
    .then((data) => {
        let albums = data.body.items
        res.render('albums', {albums})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:trackId', (req, res) =>{
    const trackId = req.params.trackId
    spotifyApi
    .getAlbumTracks(trackId)
    .then((data) => {
        let tracks = data.body.items
        res.render('tracks', {tracks})
        console.log(tracks)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
