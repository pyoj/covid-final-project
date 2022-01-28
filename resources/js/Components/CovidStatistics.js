import React from "react";

export default function CovidStatistics({
    title,
    imageUrl,
    todayCases,
    todayDeaths,
    todayRecovered,
    onDelete: handleDelete,
}) {
    return (
        <div className="relative border border border-black rounded p-2 my-2">
            <div className="my-1 inline-flex">
                <img src={imageUrl} className="block h-12 w-auto mx-2" />
                <span className="inline-flex items-center text-2xl">
                    {title}
                </span>
                <button onClick={handleDelete} className="absolute right-0">
                    <img
                        src="/assets/remove.png"
                        alt="remove"
                        className="block h-12 w-auto mx-2"
                    />
                </button>
            </div>
            <div className="grid grid-cols-3 my-3">
                <div className="border border-black text-center">
                    {todayCases} cases
                </div>
                <div className="border border-black text-center">
                    {todayDeaths} deaths
                </div>
                <div className="border border-black text-center">
                    {todayRecovered} recovered
                </div>
            </div>
        </div>
    );
}
