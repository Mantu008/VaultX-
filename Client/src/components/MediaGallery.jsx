import ImageCard from "../components/ImageCard";
import axios from "axios";

const MediaGallery = ({ media, isAuthenticated }) => {
    console.log("🔹 MediaGallery - isAuthenticated:", isAuthenticated);
    console.log("🔹 MediaGallery - media:", media);

    const handleDownload = async (url) => {
        try {
            const response = await axios.get(url, { responseType: "blob" });
            const blob = new Blob([response.data]);
            const link = document.createElement("a");

            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", url.split("/").pop());
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download file.");
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {media.length > 0 ? (
                media.map((item, index) => (
                    <div key={index} className="relative">
                        <ImageCard media={item.imgUrl} category={item.category} />
                        {isAuthenticated && (
                            <button
                                onClick={() => handleDownload(item.imgUrl)}
                                className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded"
                            >
                                Download
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No media available</p>
            )}
        </div>
    );
};

export default MediaGallery;
