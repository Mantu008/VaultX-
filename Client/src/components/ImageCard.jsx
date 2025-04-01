import { useState, useContext } from "react";
import { MediaContext } from "../context/MediaContext";
import { HeartIcon, EyeIcon, DownloadIcon, XIcon } from "lucide-react";

const ImageCard = ({ media, category, lowQualityMedia }) => {
    const { isAuthenticated } = useContext(MediaContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const isVideo = media.match(/\.(mp4|webm|ogg)$/i);

    return (
        <div className="relative border rounded-lg overflow-hidden shadow-lg group">
            {isVideo ? (
                <video controls className="w-full h-40 object-cover" preload="metadata">
                    <source src={media} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <img
                    src={lowQualityMedia}
                    srcSet={`${lowQualityMedia} 320w, ${media} 1024w`}
                    sizes="(max-width: 600px) 320px, 1024px"
                    alt={category}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            )}

            <h2 className="text-lg font-semibold mt-2 px-4">{category}</h2>

            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-gray-200"
                    onClick={() => setModalOpen(true)}
                >
                    <EyeIcon size={18} /> View Large
                </button>
            </div>

            <div className="flex justify-between items-center px-4 py-3">
                {isAuthenticated && <button className="text-red-500 hover:text-red-600">
                    <HeartIcon size={24} />
                </button>}
                {isAuthenticated && (
                    <a href={media} download className="text-gray-700 hover:text-gray-900">
                        <DownloadIcon size={24} />
                    </a>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="relative bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-3xl flex flex-col items-center max-h-[90vh] overflow-hidden">
                        <button
                            className="absolute top-2 right-2 text-black text-xl bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                            onClick={() => setModalOpen(false)}
                        >
                            <XIcon size={20} />
                        </button>
                        {isVideo ? (
                            <video controls className="w-[80vw] h-[80vh] object-contain rounded-lg">
                                <source src={media} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img src={media} alt={category} className="w-[80vw] h-[80vh] object-contain rounded-lg" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCard;
