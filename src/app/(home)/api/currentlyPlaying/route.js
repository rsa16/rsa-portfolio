import querystring from "querystring";
import { parse, toSeconds } from "iso8601-duration";

export const dynamic = "force-dynamic";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const CURRENTLY_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

const getCurrentlyPlaying = async () => {
  const { access_token } = await getAccessToken();

  return fetch(CURRENTLY_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export async function GET() {
  const response = await getCurrentlyPlaying();
  if (response.status == 200) {
    const { progress_ms, item, is_playing } = await response.json();

    let progress_s = progress_ms / 1000;
    let minutes = Math.floor(progress_s / 60);
    let seconds = Math.floor(progress_s % 60);

    let duration_s = item.duration_ms / 1000;
    let minutes_d = Math.floor(duration_s / 60);
    let seconds_d = Math.floor(duration_s % 60);

    const song = {
      name: item.name,
      timestamp: `${minutes}:${
        seconds > 0 ? (seconds < 10 ? "0" + seconds : seconds) : "00"
      }`,
      duration: `${minutes_d}:${
        seconds_d > 0 ? (seconds_d < 10 ? "0" + seconds_d : seconds_d) : "00"
      }`,
      artists: item.artists.map((_artist) => _artist.name),
      albumCover: item.album.images[0].url,
      isPlaying: is_playing
    };

    return Response.json(song);
  } else {
    return Response.json({});
  }
}
