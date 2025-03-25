const ImageCard = ({ image, canDownload }) => {
    return (
        <div className="border p-4">
            <img src={image.url} alt={image.category} className="w-full h-40 object-cover" />
            <h2 className="text-lg font-bold mt-2">{image.category}</h2>
            {canDownload && (
                <a href={image.url} download className="text-blue-500 mt-2 block">Download</a>
            )}
        </div>
    );
};

export default ImageCard;
