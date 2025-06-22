import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDestinationById } from "@/features/admin/protected/destinations/hooks/useDestinations";
import { useAllTravelPack } from "@/features/admin/protected/travel-pack/hooks/useTravelPack";
import type { ITravelPack } from "@/features/admin/protected/travel-pack/types/travel-pack";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { Button } from "@/shared/components/ui/button";
import { TravelPackCard } from "../../../travelpackage/components/catalog/TravelPackCard";
import { ArrowLeft, Clock, Building, ExternalLink, Camera, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
            <div>
                <p className="font-semibold text-gray-800">{label}</p>
                <p className="text-sm text-gray-600">{value}</p>
            </div>
        </div>
    );
};

const ImageLightbox = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };
    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <Button size="icon" className="absolute top-4 right-4 z-10 rounded-full bg-white/10 hover:bg-white/20" onClick={onClose}><X /></Button>
            <Button size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20" onClick={prevImage}><ArrowLeft /></Button>
            <Button size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20" onClick={nextImage}><ArrowRight /></Button>
            
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} 
                />
            </AnimatePresence>
        </motion.div>
    );
};

export default function DestinationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: destinationData, isLoading: isLoadingDestination } = useDestinationById(id!);
    const { data: allTravelPacksData, isLoading: isLoadingPacks } = useAllTravelPack();

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [initialImageIndex, setInitialImageIndex] = useState(0);
    const [relatedPackages, setRelatedPackages] = useState<ITravelPack[]>([]);

    useEffect(() => {
        if (destinationData?.data && allTravelPacksData?.data) {
            const relatedPackageIds = new Set(
                destinationData.data.travel_package_destinations?.map(
                    (link) => link.travel_package_id
                ) || []
            );

            const filteredPacks = allTravelPacksData.data.filter((pack) =>
                relatedPackageIds.has(pack.id)
            );
            
            setRelatedPackages(filteredPacks);
        }
    }, [destinationData, allTravelPacksData]);

    const handleOpenLightbox = (index: number) => {
        setInitialImageIndex(index);
        setLightboxOpen(true);
    };

    const isLoading = isLoadingDestination || isLoadingPacks;
    if (isLoading) return <LoadingSpinner />;
    if (!destinationData?.data) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <h2 className="text-xl font-bold">Destination Not Found</h2>
                <p className="text-gray-600">The destination you are looking for does not exist.</p>
                <Button onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    const destination = destinationData.data;
    const galleryImages = destination.image_urls || [];
    const mapEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(destination.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    const mapLinkSrc = `https://maps.google.com/maps?q=${encodeURIComponent(destination.address)}`;

    return (
        <div className="bg-white min-h-screen">
            <AnimatePresence>
                {lightboxOpen && <ImageLightbox images={galleryImages} initialIndex={initialImageIndex} onClose={() => setLightboxOpen(false)} />}
            </AnimatePresence>

            <motion.header 
                className="relative h-[60vh] md:h-[70vh] w-full text-white"
                initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.8}}
            >
                <div className="absolute inset-0">
                    <img src={galleryImages[0]} alt={destination.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="relative h-full flex flex-col justify-between p-6 md:p-12">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="group backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white w-fit">
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back
                    </Button>
                    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay: 0.2}}>
                        <p className="font-bold text-blue-300 uppercase tracking-widest">{destination.category}</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight shadow-black [text-shadow:_0_2px_4px_var(--tw-shadow-color)]">
                            {destination.name}
                        </h1>
                    </motion.div>
                </div>
                {galleryImages.length > 1 && (
                    <Button onClick={() => handleOpenLightbox(0)} className="absolute bottom-6 right-6 gap-2 bg-white/90 text-black hover:bg-white shadow-lg">
                        <Camera className="w-4 h-4"/> Show all photos
                    </Button>
                )}
            </motion.header>
            
            <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12">
                    <main className="lg:col-span-2 space-y-12">
                        <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.5, delay: 0.1}}>
                             <h2 className="text-3xl font-bold text-gray-900 mb-4">About {destination.name}</h2>
                             <div className="text-gray-700 leading-relaxed prose lg:prose-lg max-w-none">{destination.description}</div>
                        </motion.div>
                        {destination.facilities && destination.facilities.length > 0 && (
                             <motion.div className="pt-8 border-t" initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.5, delay: 0.2}}>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Facilities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {destination.facilities.map((facility) => (
                                        <div key={facility} className="flex items-center gap-3 rounded-lg bg-gray-100 p-3 border">
                                            <Building className="w-5 h-5 text-blue-600" />
                                            <span className="font-medium text-gray-800">{facility}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </main>
                    <aside className="lg:sticky lg:top-24 h-fit">
                         <motion.div className="bg-white p-6 rounded-2xl shadow-xl border" initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.5, delay: 0.3}}>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Location & Info</h3>
                            <div className="space-y-5">
                                <InfoItem icon={Clock} label="Open Hours" value={destination.open_hour} />
                                <div className="pt-5 border-t">
                                    <div className="h-48 rounded-lg overflow-hidden border">
                                        <iframe title={`Map of ${destination.name}`} src={mapEmbedSrc} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                    </div>
                                    <a href={mapLinkSrc} target="_blank" rel="noopener noreferrer" className="mt-4 block">
                                        <Button variant="outline" className="w-full gap-2"><ExternalLink className="w-4 h-4" /> Open in Google Maps</Button>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>

            {relatedPackages.length > 0 && (
                <div className="bg-gray-50 py-20">
                     <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Travel Packages Featuring This Destination</h2>
                        <p className="text-gray-600 mb-8 max-w-2xl">Explore curated journeys that include a visit to {destination.name}.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPackages.map((pack) => (
                                <TravelPackCard key={pack.id} travelPack={pack} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}