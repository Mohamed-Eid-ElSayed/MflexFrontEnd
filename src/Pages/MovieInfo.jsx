import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BsFillPlayFill } from "react-icons/bs";
import { FaHeart, FaBookmark, FaTimes } from "react-icons/fa";
import { black } from "../assets";
import Loader from "../Components/Loader";
import { useTmdbAPI } from "../Store/API";
import MovieCast from "../Components/MovieCast";
import MovieRecommendations from "./MoviesRecommendations";
import { authClient } from "../utils/authClient";

const MovieTrailer = ({ setShowTrailer }) => {
  const { movieId } = useParams();
  const [dataTrailer, setDataTrailer] = useState(null);
  const [loading, setLoading] = useState(false);
  const { tembApi } = useTmdbAPI();

  useEffect(() => {
    const fetchMovieTrailer = async () => {
      setLoading(true);
      try {
        const result = await tembApi.getMovieTrailer(movieId);
        if (result) setDataTrailer(result);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieTrailer();
  }, [movieId]);

  const trailerKey = dataTrailer?.results?.length
    ? dataTrailer.results.find((t) => t.site === "YouTube" && t.type === "Trailer")?.key
    : undefined;

  if (loading) return <Loader title="Loading Trailer..." />;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/90 backdrop-blur-xl">
      <div className="w-full flex flex-col justify-center items-center px-4">
        <FaTimes
          className="p-1 text-black font-bold rounded-full text-3xl bg-white mb-3 cursor-pointer"
          onClick={() => setShowTrailer(false)}
        />
        {trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            className="w-full max-w-[300px] h-[200px] sm:max-w-[500px] sm:h-[300px] md:max-w-[750px] md:h-[500px]"
          />
        ) : (
          <div className="text-white text-2xl mt-5">Trailer Not Found</div>
        )}
      </div>
    </div>
  );
};

const MoviePlayer = ({ setShowMovie }) => {
  const { movieId } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { tembApi } = useTmdbAPI();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const result = await tembApi.getMovieDetail(movieId);
        setMovieData(result);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetail();
  }, [movieId]);

  if (loading || !movieData) return <Loader title="Loading Movie..." />;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/90 backdrop-blur-xl">
      <div className="w-full flex flex-col justify-center items-center px-4">
        <FaTimes
          className="p-1 text-black font-bold rounded-full text-3xl bg-white mb-3 cursor-pointer"
          onClick={() => setShowMovie(false)}
        />
        <iframe
          src={movieData.playLink}
          className="w-full max-w-[300px] h-[200px] sm:max-w-[500px] sm:h-[300px] md:max-w-[750px] md:h-[500px] lg:max-w-[950px] lg:h-[600px]"
          allow="autoplay; fullscreen"
          frameBorder="0"
          allowFullScreen
          title={movieData.title || "Movie Player"}
        />
        <div className="text-white mt-4 text-center">
          <h2 className="text-xl font-bold">{movieData.title}</h2>
        </div>
      </div>
    </div>
  );
};

export default function MovieInfo() {
  const { movieId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showMovie, setShowMovie] = useState(false);
  const { tembApi, userData } = useTmdbAPI();
  const [userReactions, setUserReactions] = useState({
    isMovieLiked: false,
    isPartOfWatchlist: false,
  });

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const result = await tembApi.getMovieDetail(movieId);
        if (result) setData(result);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetail();
  }, [movieId]);

  useEffect(() => {
    const favMovies = JSON.parse(localStorage.getItem("favMovies")) || [];
    const watchlist = JSON.parse(localStorage.getItem("watchlistMovies")) || [];
    setUserReactions({
      isMovieLiked: favMovies.includes(movieId),
      isPartOfWatchlist: watchlist.includes(movieId),
    });
  }, [movieId]);

  const AddFavourite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await authClient.post(`/api/user/addtofavorites/${userData._id}/${movieId}`, {});
      if (response.status === 200) {
        const favMovies = JSON.parse(localStorage.getItem("favMovies")) || [];
        if (!favMovies.includes(movieId)) {
          favMovies.push(movieId);
          localStorage.setItem("favMovies", JSON.stringify(favMovies));
        }
        setUserReactions((prev) => ({ ...prev, isMovieLiked: true }));
      }
      if (response.data.isLiked === false) {
        const favMovies = JSON.parse(localStorage.getItem("favMovies")) || [];
        localStorage.setItem("favMovies", JSON.stringify(favMovies.filter((id) => id != movieId)));
        setUserReactions((prev) => ({ ...prev, isMovieLiked: false }));
      }
    } catch (error) {
      console.error("Error adding to favorites", error);
    }
  };

  const addToWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await authClient.post(`/api/user/addtowatchlist/${userData._id}/${movieId}`, {});
      if (response.status === 200) {
        const watchlist = JSON.parse(localStorage.getItem("watchlistMovies")) || [];
        if (!watchlist.includes(movieId)) {
          watchlist.push(movieId);
          localStorage.setItem("watchlistMovies", JSON.stringify(watchlist));
        }
        setUserReactions((prev) => ({ ...prev, isPartOfWatchlist: true }));
      }
      if (response.data.partOfWatchlist === false) {
        const watchlist = JSON.parse(localStorage.getItem("watchlistMovies")) || [];
        localStorage.setItem("watchlistMovies", JSON.stringify(watchlist.filter((id) => id != movieId)));
        setUserReactions((prev) => ({ ...prev, isPartOfWatchlist: false }));
      }
    } catch (error) {
      console.error("Error adding to watchlist", error);
    }
  };

  if (loading || !data) return <Loader />;

  return (
    // ✅ شيلنا absolute وخلناها relative عشان الفوتر ميطلعش فوقيها
    <div className="w-full pb-5">
      {/* Background Hero */}
      <div
        className="bg-cover bg-center w-full"
        style={{ backgroundImage: `url("https://image.tmdb.org/t/p/original${data?.backdrop_path}")` }}
      >
        <div className="bg-black/60 w-full flex flex-col items-center gap-6 py-8 px-4 md:gap-0 md:space-x-6 md:px-8 md:flex-row md:items-start">
          
          {/* Poster */}
          <div className="w-[160px] sm:w-[200px] md:w-[220px] shrink-0">
            <img
              src={imgLoading ? black : `https://image.tmdb.org/t/p/w500${data?.poster_path}`}
              alt={data?.original_title}
              className={`w-full rounded-lg ${imgLoading ? "h-[240px]" : "h-auto"}`}
              onLoad={() => setImgLoading(false)}
            />
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
              {data?.original_title}{" "}
              <span className="text-lightGray2 text-xl">
                ({data?.release_date?.split("-")[0]})
              </span>
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-white text-sm mt-2">
              <span>{data?.release_date}</span>
              {data?.production_countries?.length > 0 && (
                <span>({data.production_countries[0]?.iso_3166_1})</span>
              )}
              <span className="h-[4px] w-[4px] rounded-full bg-white inline-block" />
              <span>
                {data?.genres?.map((g, i) =>
                  i === data.genres.length - 1 ? g.name : `${g.name}, `
                )}
              </span>
              <span className="h-[4px] w-[4px] rounded-full bg-white inline-block" />
              <span>{data?.runtime} min</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 my-4">
              <button
                className="flex items-center gap-1 bg-mainorange px-4 py-2 rounded-lg text-white text-sm font-medium"
                onClick={() => setShowTrailer(true)}
              >
                <BsFillPlayFill /> Play Trailer
              </button>
              <button
                className="flex items-center gap-1 bg-mainorange px-4 py-2 rounded-lg text-white text-sm font-medium"
                onClick={() => setShowMovie(true)}
              >
                <BsFillPlayFill /> Play Movie
              </button>
              <button
                onClick={AddFavourite}
                className={`p-3 rounded-full bg-secondaryGray transition-colors ${
                  userReactions.isMovieLiked ? "text-red-500" : "text-white"
                }`}
              >
                <FaHeart />
              </button>
              <button
                onClick={addToWatchlist}
                className={`p-3 rounded-full bg-secondaryGray transition-colors ${
                  userReactions.isPartOfWatchlist ? "text-green-500" : "text-white"
                }`}
              >
                <FaBookmark />
              </button>
            </div>

            {/* Tagline */}
            {data?.tagline && (
              <p className="text-lightGray2 italic mb-3 text-sm">"{data.tagline}"</p>
            )}

            {/* Overview */}
            <div>
              <h2 className="font-bold text-lg text-white mb-2">Overview</h2>
              <p className="text-white text-sm md:text-base leading-relaxed">
                {data?.overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cast & Recommendations */}
      <div className="w-full px-3 mt-4">
        <div>
          <h2 className="text-white text-2xl sm:text-3xl mb-2">Cast</h2>
          <MovieCast movieId={movieId} />
        </div>
        <div className="mt-10">
          <h2 className="text-white text-2xl sm:text-3xl mb-2">Recommendations</h2>
          <MovieRecommendations movieId={movieId} />
        </div>
      </div>

      {/* Popups */}
      {showTrailer && <MovieTrailer setShowTrailer={setShowTrailer} />}
      {showMovie && <MoviePlayer setShowMovie={setShowMovie} />}
    </div>
  );
}
