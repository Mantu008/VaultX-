const ImageCard = ({ media, category, canDownload }) => {
    const isVideo = media.match(/\.(mp4|webm|ogg)$/i); // Check if file is a video

    return (
        <div className="border p-4">
            {isVideo ? (
                <video controls className="w-full h-40 object-cover" preload="metadata">
                    <source src={media} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <img src={media} alt={category} className="w-full h-40 object-cover" loading="lazy" />
            )}
            <h2 className="text-lg font-bold mt-2">{category}</h2>
            {canDownload && (
                <a href={media} download className="text-blue-500 mt-2 block">Download</a>
            )}
        </div>
    );
};

export default ImageCard;
