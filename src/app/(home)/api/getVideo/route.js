import querystring from "querystring";
import { parse, toSeconds } from "iso8601-duration";

const yt_api_key = process.env.YOUTUBE_API_KEY;

const YTSEARCH_ENDPOINT = `https://www.googleapis.com/youtube/v3/search`;
const YTVIDEOS_ENDPOINT = `https://www.googleapis.com/youtube/v3/videos`;

const getAudioStream = async (song) => {
  const url =
    YTSEARCH_ENDPOINT +
    "?" +
    querystring.stringify({
      key: yt_api_key,
      part: "snippet",
      type: "video",
      videoCategoryId: "10",
      q: `${song.artists.join(", ")} - ${song.name}`,
    });

  const response = await fetch(url);
  const { items } = await response.json();

  var index = 0;
  var videoID = null;
  var durations = [];
  var songFound = false;

  let _sd = song.duration.split(":").map((a) => parseInt(a));
  let duration_s = _sd[0] * 60 + _sd[1];

  while (index < items.length) {
    videoID = items[index].id.videoId;
    const videoURL =
      YTVIDEOS_ENDPOINT +
      "?" +
      querystring.stringify({
        key: yt_api_key,
        id: videoID,
        part: "contentDetails",
      });

    const videoResponse = await fetch(videoURL);
    const videoContentDetails = await videoResponse.json();
    let duration_iso = parse(
      videoContentDetails.items[0].contentDetails.duration
    );

    let minutes = duration_iso.minutes;
    let seconds = Math.floor(duration_iso.seconds);
    let videoDuration = `${minutes}:${
      seconds > 0 ? (seconds < 10 ? "0" + seconds : seconds) : "00"
    }`;

    durations.push({
      seconds: toSeconds(duration_iso),
      id: videoID,
    });

    if (videoDuration !== song.duration) {
      index++;
    } else {
      songFound = true;
      break;
    }
  }

  if (!songFound) {
    let durs = durations.map((a) => a.seconds);
    var closest = durs.reduce(function (prev, curr) {
      return Math.abs(curr - duration_s) < Math.abs(prev - duration_s)
        ? curr
        : prev;
    });
    videoID = durations.find((a) => a.seconds == closest).id;
  }

  return `https://www.youtube.com/watch?v=${videoID}`;
};

export async function POST(request)
{
  const song = await request.json();
  const audioStream = await getAudioStream(song);
  return Response.json({ audioStream });
}