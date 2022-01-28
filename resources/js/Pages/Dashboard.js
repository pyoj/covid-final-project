import React, { useState, useEffect } from "react";
import Authenticated from "@/Layouts/Authenticated";
import { Head } from "@inertiajs/inertia-react";
import AsyncSelect from "react-select/async";
import Datamap from "react-datamaps";

import CovidStatistics from "../Components/CovidStatistics";

export default function Dashboard(props) {
    const [todayCases, setTodayCases] = useState(0);
    const [todayDeaths, setTodayDeaths] = useState(0);
    const [todayRecovered, setTodayRecovered] = useState(0);

    const [allCountriesData, setAllCountriesData] = useState([]);
    const [countries, setCountries] = useState([]);
    const [map, setMap] = useState({});

    const [countryValue, setCountryValue] = useState(null);

    useEffect(() => {
        fetchTodayData();
        fetchSavedCountries();
        fetchAllCountriesData();
    }, []);

    useEffect(() => {
        const countriesMap = {};

        countries.forEach((country) => {
            countriesMap[country.countryInfo.iso3] = "red";
        });

        setMap(countriesMap);
    }, [countries]);

    const fetchAllCountriesData = () => {
        fetch("https://disease.sh/v3/covid-19/countries")
            .then((response) => response.json())
            .then((json) => setAllCountriesData(json));
    };

    const fetchTodayData = () => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((json) => {
                setTodayCases(json.todayCases);
                setTodayDeaths(json.todayDeaths);
                setTodayRecovered(json.todayRecovered);
            });
    };

    const fetchSavedCountries = () => {
        fetch("/api/countries/saved")
            .then((response) => response.json())
            .then((json) => {
                if (json.result.length) {
                    const countriesList = json.result
                        .map((c) => c.code)
                        .join(",");

                    fetch(
                        "https://disease.sh/v3/covid-19/countries/" +
                            countriesList
                    )
                        .then((response) => response.json())
                        .then((json) => {
                            if (
                                Object.prototype.toString.call(json) ==
                                "[object Object]"
                            ) {
                                setCountries([json]);
                            } else {
                                setCountries(json);
                            }
                        });
                } else {
                    setCountries([]);
                }
            });
    };

    const handleAddCountry = () => {
        if (!countryValue) {
            alert("Please choose country!");
            return;
        }

        const token = document.head.querySelector('meta[name="csrf-token"]');
        const data = {
            country_id: countryValue.value,
        };

        fetch("/api/countries/create/saved", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": token.content,
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
            })
            .then(fetchSavedCountries)
            .catch((error) => alert(error));
    };

    const handleRemoveCountry = (id) => {
        const token = document.head.querySelector('meta[name="csrf-token"]');

        fetch("/api/countries/saved/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": token.content,
            },
        }).then(fetchSavedCountries);
    };

    const drawCountryStats = (countryCode) => {
        const data = allCountriesData.find(
            (c) => c.countryInfo.iso3 === countryCode
        );

        return `
        <div class="bg-orange-200 my-1 p-2">
            <div class="inline-flex">
                <img src='${data.countryInfo.flag}' class="block h-3 w-auto mx-1" />
                <p class="inline-flex items-center text-xs">${data.country}</p>
            </div>
            <p class="items-center text-xs">${data.cases} total cases</p>
            <p class="items-center text-xs">${data.deaths} total deaths</p>
            <p class="items-center text-xs">${data.recovered} total recovered</p>
        </div>`;
    };

    const loadCountriesOptions = (val) => {
        return fetch(
            "/api/countries/list?" +
                new URLSearchParams({
                    input: val,
                })
        )
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                const options = json.result.map((option) => ({
                    label: option.name,
                    value: option.id,
                }));

                return options;
            });
    };

    return (
        <Authenticated auth={props.auth} errors={props.errors}>
            <Head title="Dashboard" />

            <div className="py-6 flex">
                <div className="max-w-7xl sm:px-6 lg:px-8 flex-1">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h6>World Map</h6>
                            {allCountriesData.length ? (
                                <Datamap
                                    scope="world"
                                    data={map}
                                    geographyConfig={{
                                        popupOnHover: true,
                                        highlightOnHover: true,
                                        popupTemplate: (geography, data) =>
                                            drawCountryStats(geography.id),
                                    }}
                                    responsive
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex-1">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="py-6">
                                <h6>Global Stats</h6>
                                <div className="border border border-black rounded p-2">
                                    <div className="my-1 inline-flex">
                                        <img
                                            src="assets/world.png"
                                            className="block h-12 w-auto mx-2"
                                        />
                                        <span className="inline-flex items-center text-2xl">
                                            World
                                        </span>
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
                            </div>
                            <div className="py-6">
                                <h6>Add your country</h6>
                                <div className="py-6 flex">
                                    <AsyncSelect
                                        className="flex-1 px-1"
                                        menuPosition="fixed"
                                        loadOptions={loadCountriesOptions}
                                        onChange={setCountryValue}
                                        value={countryValue}
                                        cacheOptions
                                        defaultOptions
                                    />
                                    <button
                                        className="flex-2 bg-lime-400 text-white p-1 rounded"
                                        onClick={handleAddCountry}
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="rounded px-2 grid grid-cols-1">
                                    {countries.map((item) => (
                                        <CovidStatistics
                                            key={item.countryInfo._id}
                                            title={item.country}
                                            imageUrl={item.countryInfo.flag}
                                            todayCases={item.todayCases}
                                            todayDeaths={item.todayDeaths}
                                            todayRecovered={item.todayRecovered}
                                            onDelete={() =>
                                                handleRemoveCountry(
                                                    item.countryInfo.iso3
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
