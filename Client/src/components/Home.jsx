// import { useContext } from "react";
import { MediaContext } from "../context/MediaContext";
import MediaGallery from "../components/MediaGallery";

const Home = () => {
    // const { media, isAuthenticated } = useContext(MediaContext);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Gallery</h1>
            <MediaGallery />
        </div>
    );
};

export default Home;
