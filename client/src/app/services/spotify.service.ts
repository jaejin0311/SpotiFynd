import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    //Note: toPromise() is a deprecated function that will be removed in the future.
    //It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    //yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    const url = this.expressBaseUrl + endpoint;

    // Use Angular's HttpClient to make a GET request to the Express endpoint
    return firstValueFrom(this.http.get(this.expressBaseUrl + endpoint)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    
    let resources = [];
    return this.sendRequestToExpress(`/search/${category}/${encodeURIComponent(resource)}`).then((dataArray) => {
      switch (category) {
        case 'artist':
          return dataArray['artists']['items'].map((artist) => {
            let artistData = new ArtistData(artist);
            artistData.url = `http://localhost:4200/artist/${artistData.id}`;
            return artistData;
          });
        case 'album':
          return dataArray['albums']['items'].map((artist) => {
            let albumData = new AlbumData(artist);
            albumData.url = `http://localhost:4200/album/${albumData.id}`;
            return albumData;
          });
        case 'track':
          return dataArray['tracks']['items'].map((artist) => {
            let trackData = new TrackData(artist);
            trackData.url = `http://localhost:4200/track/${trackData.id}`;
            return trackData;
          });
        default:
          throw new Error(`Unknown category: ${category}`);
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    return this.sendRequestToExpress(`/artist/${encodeURIComponent(artistId)}`).then((artistData) => {
      artistData = new ArtistData(artistData);
      artistData.url = `http://localhost:4200/artist/${artistData.id}`;
      return artistData;
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    return this.sendRequestToExpress(`/artist-related-artists/${encodeURIComponent(artistId)}`).then(relatedArtistsArray => {
      return relatedArtistsArray['artists'].map(artist => {
        let artistData = new ArtistData(artist);
        artistData.url = `http://localhost:4200/artist/${artistData.id}`;
        return artistData;
      });
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    return this.sendRequestToExpress(`/artist-top-tracks/${encodeURIComponent(artistId)}`).then(trackData => {
      return trackData['tracks'].map(track => {
        let trackData = new TrackData(track);
        trackData.url = `http://localhost:4200/track/${trackData.id}`;
        return trackData;
      });
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    return this.sendRequestToExpress(`/artist-albums/${encodeURIComponent(artistId)}`).then(albumData => {
      return albumData['items'].map(album => {
        let albumData = new AlbumData(album);
        albumData.url = `http://localhost:4200/album/${albumData.id}`;
        return albumData;
      });
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return this.sendRequestToExpress(`/album/${encodeURIComponent(albumId)}`).then(albumData => {
      let album = new AlbumData(albumData);
      album.url = `http://localhost:4200/album/${album.id}`;
      return album;
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    return this.sendRequestToExpress(`/album-tracks/${encodeURIComponent(albumId)}`).then(trackData => {
      return trackData['items'].map(track => {
        let trackData = new TrackData(track);
        trackData.url = `http://localhost:4200/track/${trackData.id}`;
        return trackData;
      });
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return this.sendRequestToExpress(`/track/${encodeURIComponent(trackId)}`).then(data => {
      let trackData = new TrackData(data);
      trackData.url = `http://localhost:4200/track/${trackData.id}`;
      return trackData;
    });
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    return this.sendRequestToExpress(`/track-audio-features/${trackId}`).then((trackData) => {
      // Filter and map only the desired features
      return TrackFeature.FeatureTypes.map(feature => {
          return new TrackFeature(feature, trackData[feature]);
      }).filter(feature => feature.percent !== undefined); // Filter out any features not present in trackData
    });
  }
}
