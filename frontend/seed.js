import axios from 'axios';
import FormData from 'form-data';

const JAMENDO_CLIENT_ID = '9a079ee8'; 
const BACKEND_URL = 'http://localhost:8080/api';

async function getFileStreamFromUrl(url) {
  if (!url) return null;
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function seedData() {
  try {
    console.log('Đang lấy dữ liệu bài hát từ Jamendo...');
    
    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 15, 
        offset: 30,
        include: 'musicinfo',
        audioformat: 'mp32' 
      }
    });

    const tracks = response.data.results;
    console.log(`Đã lấy được ${tracks.length} bài hát từ Jamendo.\n`);

    const artistsMap = new Map();
    const albumsMap = new Map();

    for (const track of tracks) {
      if (!artistsMap.has(track.artist_id)) {
        artistsMap.set(track.artist_id, {
          name: track.artist_name,
          avatarUrl: track.artist_image || track.album_image || track.image,
          bio: `Nghệ sĩ độc lập trên Jamendo - Phong cách: ${track.musicinfo?.tags?.genres?.[0] || 'Đa dạng'}`
        });
      }
      if (track.album_id && !albumsMap.has(track.album_id)) {
        albumsMap.set(track.album_id, {
          title: track.album_name,
          coverUrl: track.album_image || track.image,
          releaseDate: track.releasedate || '2024-01-01',
          artistId: track.artist_id
        });
      }
    }

    console.log(`Đang tải và lưu ${artistsMap.size} Nghệ sĩ...`);
    const artistIdMapping = new Map();

    for (const [jamendoArtistId, artistData] of artistsMap.entries()) {
      try {
        const form = new FormData();
        form.append('name', artistData.name);
        form.append('bio', artistData.bio);
        
        if (artistData.avatarUrl) {
          const avatarStream = await getFileStreamFromUrl(artistData.avatarUrl);
          form.append('avatarFile', avatarStream, 'avatar.jpg');
        }

        const res = await axios.post(`${BACKEND_URL}/artists`, form, {
          headers: form.getHeaders()
        });
        
        artistIdMapping.set(jamendoArtistId, res.data.id);
        console.log(`  + Thành công: ${artistData.name}`);
      } catch (err) {
        console.log(`  - Lỗi khi tạo nghệ sĩ ${artistData.name}:`, err.response?.data?.message || err.message);
      }
    }

    console.log(`\nĐang tải và lưu ${albumsMap.size} Album...`);
    const albumIdMapping = new Map();

    for (const [jamendoAlbumId, albumData] of albumsMap.entries()) {
      const myArtistId = artistIdMapping.get(albumData.artistId);
      if (!myArtistId) continue;

      try {
        const form = new FormData();
        form.append('title', albumData.title);
        form.append('releaseDate', albumData.releaseDate);
        form.append('artistId', myArtistId);
        
        if (albumData.coverUrl) {
          const coverStream = await getFileStreamFromUrl(albumData.coverUrl);
          form.append('coverFile', coverStream, 'cover.jpg');
        }

        const res = await axios.post(`${BACKEND_URL}/albums`, form, {
          headers: form.getHeaders()
        });
        
        albumIdMapping.set(jamendoAlbumId, res.data.id);
        console.log(`  + Thành công: ${albumData.title}`);
      } catch (err) {
        console.log(`  - Lỗi khi tạo album ${albumData.title}:`, err.response?.data?.message || err.message);
      }
    }

    console.log(`\n Đang tải mp3 và lưu ${tracks.length} Bài hát...`);
    for (const track of tracks) {
      const myArtistId = artistIdMapping.get(track.artist_id);
      const myAlbumId = albumIdMapping.get(track.album_id) || null;

      if (!myArtistId) continue;

      try {
        const form = new FormData();
        form.append('title', track.name);
        form.append('genre', track.musicinfo?.tags?.genres?.[0] || 'Pop');
        form.append('duration', track.duration);
        form.append('artistId', myArtistId);
        if (myAlbumId) form.append('albumId', myAlbumId);

        if (track.audio) {
          const audioStream = await getFileStreamFromUrl(track.audio);
          form.append('audioFile', audioStream, 'audio.mp3');
        }

        const imgUrl = track.image || track.album_image;
        if (imgUrl) {
          const imageStream = await getFileStreamFromUrl(imgUrl);
          form.append('imageFile', imageStream, 'song-cover.jpg');
        }

        await axios.post(`${BACKEND_URL}/songs/upload`, form, {
          headers: form.getHeaders()
        });
        
        console.log(`  Hoàn tất: ${track.name}`);
      } catch (err) {
        console.log(`  x Lỗi up bài ${track.name}:`, err.response?.data?.message || err.message);
      }
    }

    console.log('\nNẠP DỮ LIỆU THÀNH CÔNG! Tất cả file đã được đẩy lên Cloud và lưu vào DB.');

  } catch (error) {
    console.error('Lỗi khi chạy Seeder:', error.message);
  }
}

seedData();