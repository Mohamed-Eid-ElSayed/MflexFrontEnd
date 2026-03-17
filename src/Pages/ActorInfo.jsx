import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { black } from "../assets";
import Loader from "../Components/Loader";
import { useTmdbAPI } from "../Store/API";

const ActorCredits = () => {
  const { actorId } = useParams();
  const { tembApi } = useTmdbAPI();
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchgetActorCredits = async () => {
      setLoading(true);
      try {
        const data = await tembApi.getActorCredits(actorId);
        if (data?.cast) setMovies(data.cast);
      } finally {
        setLoading(false);
      }
    };
    fetchgetActorCredits();
  }, [actorId]);

  if (loading) return <Loader />;

  return (
    <div className="w-full flex flex-wrap items-start justify-center gap-3">
      {movies.map((movie) => (
        <Link key={movie?.id} to={`/movieInfo/${movie?.id}`}>
          <div className="flex-none w-[130px] sm:w-[160px] md:w-[180px] flex flex-col justify-center items-center space-y-1">
            <img
              src={
                movie?.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie?.poster_path}`
                  : black
              }
              className="w-full h-[195px] sm:h-[240px] md:h-[270px] rounded-lg object-cover"
              alt={movie?.original_title}
            />
            <div className="text-lightGray2 font-medium text-xs sm:text-sm text-center w-full truncate px-1">
              {movie?.original_title}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const ActorInfo = () => {
  const { actorId } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { tembApi } = useTmdbAPI();
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    const fetchgetActorDetail = async () => {
      setLoading(true);
      try {
        const result = await tembApi.getActorDetail(actorId);
        if (result) setData(result);
      } finally {
        setLoading(false);
      }
    };
    fetchgetActorDetail();
  }, [actorId]);

  if (loading || !data) return <Loader />;

  const currentYear = new Date().getFullYear();
  const birthYear = data?.birthday?.split("-")[0];
  const age = birthYear ? currentYear - parseInt(birthYear) : null;

  return (
    <div className="w-full flex flex-col md:flex-row items-start gap-6 py-4 px-2 md:px-0">

      {/* Left column - صورة + info */}
      <div className="w-full md:w-3/12 flex flex-col items-center md:items-start gap-4">
        {/* صورة الممثل */}
        <img
          src={
            imgLoading
              ? black
              : `https://image.tmdb.org/t/p/w500${data?.profile_path}`
          }
          alt={data?.name}
          className="rounded-lg shadow-lg shadow-black/50 w-[220px] sm:w-[260px] md:w-full object-cover"
          onLoad={() => setImgLoading(false)}
        />

        {/* Personal Info */}
        <div className="w-full text-center md:text-left">
          <h2 className="text-white font-semibold text-xl mb-3">Personal Info</h2>
          <div className="flex flex-col gap-3">

            <div>
              <p className="text-white font-semibold text-sm">Known For</p>
              <p className="text-lightGray2 text-sm">{data?.known_for_department || "N/A"}</p>
            </div>

            <div>
              <p className="text-white font-semibold text-sm">Gender</p>
              <p className="text-lightGray2 text-sm">
                {data?.gender === 1 ? "Female" : data?.gender === 2 ? "Male" : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-white font-semibold text-sm">Birthday</p>
              <p className="text-lightGray2 text-sm">
                {data?.birthday
                  ? `${data.birthday} (${age} years old)`
                  : "Not provided"}
              </p>
            </div>

            {data?.deathday && (
              <div>
                <p className="text-white font-semibold text-sm">Died</p>
                <p className="text-lightGray2 text-sm">{data.deathday}</p>
              </div>
            )}

            <div>
              <p className="text-white font-semibold text-sm">Place of Birth</p>
              <p className="text-lightGray2 text-sm">{data?.place_of_birth || "Not provided"}</p>
            </div>

            {data?.also_known_as?.length > 0 && (
              <div>
                <p className="text-white font-semibold text-sm">Also Known As</p>
                <div className="flex flex-col gap-1 mt-1">
                  {data.also_known_as.map((name) => (
                    <p key={name} className="text-lightGray2 text-xs">{name}</p>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Right column - اسم + biography + أفلامه */}
      <div className="w-full md:w-9/12 flex flex-col gap-6">
        <h1 className="text-white font-bold text-3xl">{data?.name}</h1>

        {/* Biography */}
        {data?.biography && (
          <div>
            <h2 className="text-white font-bold text-xl mb-2">Biography</h2>
            <p className="text-lightGray2 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {data.biography}
            </p>
          </div>
        )}

        {/* Known For */}
        <div>
          <h2 className="text-white font-bold text-xl mb-4">Known For</h2>
          <ActorCredits />
        </div>
      </div>

    </div>
  );
};

export default ActorInfo;
